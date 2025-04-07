# Copyright (c) 2024, Simon Wanyama and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Business(Document):
	def validate(self):
		
		self.validate_dates()
		self.validate_share_percentage()
		self.validate_business_documents()

		self.activate_inactive_staff()
		self.activate_inactive_vehicle()

		# if len(self.business_partners) < 1 and len(self.individual_partners) < 1:
		# 	frappe.throw("Please add at least one Business Partner (Individual or Business)")
	def before_save(self):
		self.create_customer()

	def on_trash(self):
		frappe.delete_doc('Customer', self.customer, force=True)
	def create_customer(self):
		exists = frappe.db.exists('Customer', self.name)
		if not exists:
			customer = frappe.get_doc({
				'doctype': 'Customer',
				'customer_name': self.name,
				'customer_type': 'Company',
			})
			customer.insert()
			self.customer = frappe.db.get_value('Customer', self.name, 'name')
	def validate_business_documents(self):
		for row in self.business_documents:
			legal_doc = frappe.get_doc('Legal Document', row.document_type)
			if legal_doc.document_type != 'Business Document':
				frappe.throw(f'Documents of Type {legal_doc.document_type} are not supported for Additional Business Documents')
				row.delete()

	def validate_dates(self):
		date_fields = [
            'licence',
            'matafi',
            'lec',
            'iec',
        ]

		for field in date_fields:
			date_field = [word.capitalize() for word in field.split('_')]
			date_field = ' '.join(date_field)

			if not getattr(self, f'{field}_issue_date') or not getattr(self, f'{field}_expiry_date'):
				continue
			if getattr(self, f'{field}_issue_date') > getattr(self, f'{field}_expiry_date'):
				frappe.throw(f'{date_field} Date of Issue cannot be after {date_field} Date of Expiry')
	
	def validate_share_percentage(self):
		shares = [float(row.share_percentage) for row in self.business_partners +  self.individual_partners]
		if len(shares):
			if sum(shares) > 100:
				frappe.throw('Total Shares Percentage cannot be greater than 100%')

	def activate_inactive_staff(self):
		for staff in self.business_staff:
			staff_personnel = frappe.get_doc('Personnel', staff.staff_name)
			# Activate if Inactive
			if not staff_personnel.active:
				staff_personnel.active = 1
				staff_personnel.save()

	def activate_inactive_vehicle(self):
		for vehicle in self.business_vehicles:
			business_vehicle = frappe.get_doc('Car and Carrier', vehicle.license_plate_number)
			# Activate if Inactive
			if not business_vehicle.active:
				business_vehicle.active = 1
				business_vehicle.save()