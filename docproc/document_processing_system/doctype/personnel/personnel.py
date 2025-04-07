# Copyright (c) 2024, Simon Wanyama and contributors
# For license information, please see license.txt

import json
import frappe
from frappe.model.document import Document

from docproc.document_processing_system.utils.cleardocs_utils import reset_child_table_indices


class Personnel(Document):
	def before_save(self):
		self.validate_phone_input()
		self.create_customer()

	def after_insert(self):
		self.update_business_personnel()
		

	def on_update(self):
		# Run the update_business_personnel only if not deactivating
		if not getattr(self, '_deactivating', False):
			self.update_business_personnel()

	def create_customer(self):
		exists = frappe.db.exists('Customer', self.full_name)
		if not exists and self.is_customer:
			customer = frappe.get_doc({
				'doctype': 'Customer',
				'customer_name': self.full_name,
				'customer_type': 'Individual',
			})
			customer.insert()
			self.customer = frappe.get_value('Customer', self.full_name, 'name')
		elif exists and not self.is_customer:
			self.customer = ''
			frappe.delete_doc('Customer', self.full_name, force=True)
		
	def validate(self):
		# Set is_customer based on personnel_type
		if self.personnel_type == "Individual":
			self.is_customer = 1
		else:
			self.is_customer = 0
   
		self.validate_dates()
		self.validate_additional_personnel_documents()

		self.activate_inactive_dependent()
		self.activate_inactive_personnel_vehicle()

	def validate_dates(self):
		date_fields = [
            'passport',
            'visa',
            'emirates_card',
            'labor_card',
            'health_insurance',
            'driving_licence',
        ]

		for field in date_fields:
			date_field = [word.capitalize() for word in field.split('_')]
			date_field = ' '.join(date_field)

			if not getattr(self, f'{field}_date_of_issue') or not getattr(self, f'{field}_date_of_expiry'):
				continue
			if getattr(self, f'{field}_date_of_issue') > getattr(self, f'{field}_date_of_expiry'):
				frappe.throw(f'{date_field} Date of Issue cannot be greater than {date_field} Date of Expiry')
		
	def validate_phone_input(self):
		if self.phone_number == "+971- " or self.phone_number == "+971 ":
			self.phone_number = ""
	def validate_additional_personnel_documents(self):
		for row in self.additional_personnel_documents:
			legal_doc = frappe.get_doc('Legal Document', row.document_type)
			if legal_doc.document_type != 'Individual Document':
				frappe.throw(f'Document type {legal_doc.document_type} is not supported for Additional Personnel Documents')
				row.delete()

	def update_business_personnel(self):
		# If not active, handle deactivation
		if not self.active:
			self.handle_deactivation()
			return

		# Handle activation based on personnel type
		if self.personnel_type == "Business Staff" and self.business:
			self.handle_business_staff_activation()
		elif self.personnel_type == "Dependent" and self.primary_personnel:
			self.handle_dependent_activation()
		elif self.personnel_type == "Individual":
			self.handle_individual_activation()	

	def handle_deactivation(self):
		if self.personnel_type == "Business Staff":
			if self.business:
				self.delete_from_business_staff(self.business, self.name)
			else:
				self.delete_from_business_staff(None, self.name)
		elif self.personnel_type == "Dependent":
			if self.primary_personnel:
				self.delete_from_personnel_dependents(self.primary_personnel, self.name)
			else:
				self.delete_from_personnel_dependents(None, self.name)
		elif self.personnel_type == "Individual":
			self.delete_from_business_staff(None, self.name)
			self.delete_from_personnel_dependents(None, self.name)

	def handle_business_staff_activation(self):
		# Delete from personnel_dependents if exists
		self.delete_from_personnel_dependents(None, self.name)
		self.delete_from_business_staff(None, self.name)

		business_doc = frappe.get_doc('Business', self.business)
		existing_personnel = next((personnel for personnel in business_doc.business_staff if personnel.staff_name == self.name), None)

		if existing_personnel:
			frappe.msgprint(f'{self.name} is already in a Business Staff of {self.business}')
		else:
			business_doc.append('business_staff', {
				'staff_name': self.name,
				'resident_status': self.resident_status,
				'email_address': self.email_address,
				'phone_number': self.phone_number
			})
			business_doc.save()
			# frappe.msgprint(f'{self.name} has been added to the Business Staff of {self.business}')


	def handle_dependent_activation(self):
		# Delete from business_staff and dependents if exists
		self.delete_from_business_staff(None, self.name)
		self.delete_from_personnel_dependents(None, self.name)

		personnel_doc = frappe.get_doc('Personnel', self.primary_personnel)
		existing_personnel = next((personnel for personnel in personnel_doc.personnel_dependents if personnel.dependent_name == self.name), None)

		if existing_personnel:
			frappe.msgprint(f'{self.name} is already in the Personnel Dependents of {self.primary_personnel}')
		else:
			personnel_doc.append('personnel_dependents', {
				'dependent_name': self.name,
				'resident_status': self.resident_status,
				'email_address': self.email_address,
				'phone_number': self.phone_number
			})
			personnel_doc.save()
			# frappe.msgprint(f'{self.name} has been added to the Personnel Dependents of {self.primary_personnel}')
	
	def handle_individual_activation(self):
		# Ensure the personnel is not part of any business or dependent in any personnel
		self.delete_from_business_staff(None, self.name)
		self.delete_from_personnel_dependents(None, self.name)

	def delete_from_business_staff(self, business_name, personnel_name):
		if business_name:
			business_doc = frappe.get_doc('Business', business_name)
		else:
			business_doc = frappe.get_all('Business', fields=['name'])
		
		if isinstance(business_doc, list):
			for business in business_doc:
				business = frappe.get_doc('Business', business.name)
				existing_personnel = next((personnel for personnel in business.business_staff if personnel.staff_name == personnel_name), None)
				if existing_personnel:
					business.get('business_staff').remove(existing_personnel)
					business.save()
					# frappe.msgprint(f'{personnel_name} has been removed from the Business Staff of {business.name}')
		else:
			existing_personnel = next((personnel for personnel in business_doc.business_staff if personnel.staff_name == personnel_name), None)
			if existing_personnel:
				business_doc.get('business_staff').remove(existing_personnel)
				reset_child_table_indices(business_doc, 'business_staff')
				business_doc.save()
				# frappe.msgprint(f'{personnel_name} has been removed from the Business Staff of {business_name}')

	def delete_from_personnel_dependents(self, primary_personnel_name, dependent_name):
		if primary_personnel_name:
			personnel_doc = frappe.get_doc('Personnel', primary_personnel_name)
		else:
			personnel_doc = frappe.get_all('Personnel', fields=['name'])

		if isinstance(personnel_doc, list):
			for personnel in personnel_doc:
				personnel = frappe.get_doc('Personnel', personnel.name)
				existing_personnel = next((personnel for personnel in personnel.personnel_dependents if personnel.dependent_name == dependent_name), None)
				if existing_personnel:
					personnel.get('personnel_dependents').remove(existing_personnel)
					personnel.save()
					# frappe.msgprint(f'{dependent_name} has been removed from Personnel Dependents of {personnel.name}')
		else:
			existing_personnel = next((personnel for personnel in personnel_doc.personnel_dependents if personnel.dependent_name == dependent_name), None)
			if existing_personnel:
				personnel_doc.get('personnel_dependents').remove(existing_personnel)
				reset_child_table_indices(personnel_doc, 'personnel_dependents')
				personnel_doc.save()
				# frappe.msgprint(f'{dependent_name} has been removed from Personnel Dependents of {primary_personnel_name}')
				
				# Alert after sucess
				# frappe.msgprint(
				# 	msg=f'{business_doc.get_title()} Updated Successfully',
				# 	title='Success',
				# 	indicator='green'
				# )

	def activate_inactive_dependent(self):
		for dependent in self.personnel_dependents:
			personnel_dependent = frappe.get_doc('Personnel', dependent.dependent_name)
			# Activate if Inactive
			if not personnel_dependent.active:
				personnel_dependent.active = 1
				personnel_dependent.save()

	def activate_inactive_personnel_vehicle(self):
		for vehicle in self.personnel_vehicles:
			personnel_vehicle = frappe.get_doc('Car and Carrier', vehicle.license_plate_number)
			# Activate if Inactive
			if not personnel_vehicle.active:
				personnel_vehicle.active = 1
				personnel_vehicle.save()
	


	
@frappe.whitelist()
def deactivate_personnel(personnel):
	if personnel and frappe.db.exists('Personnel', personnel):
		doc = frappe.get_doc('Personnel', personnel)
		if doc.active:
			doc.active = 0
			doc._deactivating = True 
			doc.save()
			return f'{doc.get_title()} Has Been Deactivated'
		else:
			return f'{doc.get_title()} Already Deactivated!'


