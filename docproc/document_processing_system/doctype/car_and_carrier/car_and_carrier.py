# Copyright (c) 2024, Simon Wanyama and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

from docproc.document_processing_system.utils.cleardocs_utils import reset_child_table_indices


class CarandCarrier(Document):
    def validate(self):
        self.validate_dates()
    def after_insert(self):
        self.update_car_ownership()

    def on_update(self):
		# Run the update_car_ownership only if not deactivating
        if not getattr(self, '_deactivating', False):
            self.update_car_ownership()

    def validate_dates(self):
        if self.mulkiya_date_of_issue > self.mulkiya_date_of_expiry:
            frappe.throw("Mulkiya Date of Issue cannot be after Mulkiya Date of Expiry")


    def update_car_ownership(self):
        # If not active, handle deactivation
        if not self.active:
            self.handle_deactivation()
            return

        # Handle activation based on owner type
        if self.owner_type == "Business" and self.business_owner:
            self.handle_business_owner_activation()
        elif self.owner_type == "Personnel" and self.personal_owner:
            self.handle_personal_owner_activation()

    def handle_deactivation(self):
        if self.owner_type == "Business":
            if self.business_owner:
                self.delete_from_business_vehicles(self.business_owner, self.name)
            else:
                self.delete_from_business_vehicles(None, self.name)
        elif self.owner_type == "Personnel":
            if self.personal_owner:
                self.delete_from_personnel_vehicles(self.personal_owner, self.name)
            else:
                self.delete_from_personnel_vehicles(None, self.name)

    
    def handle_business_owner_activation(self):
        # Ensure the car is not part of any other business or personnel
        self.delete_from_personnel_vehicles(None, self.name)
        self.delete_from_business_vehicles(None, self.name)

        business_doc = frappe.get_doc('Business', self.business_owner)
        existing_vehicle = next((vehicle for vehicle in business_doc.business_vehicles if vehicle.license_plate_number == self.name), None)

        if existing_vehicle:
            frappe.msgprint(f'{self.name} is already in the Business Vehicles of {self.business_owner}')
        else:
            business_doc.append('business_vehicles', {
                'license_plate_number': self.name,
                'mulkiya_number': self.mulkiya_number,
                'mulkiya_date_of_issue': self.mulkiya_date_of_issue,
                'mulkiya_date_of_expiry': self.mulkiya_date_of_expiry,
                'insurance_date_of_issue': self.policy_start_date,
                'insurance_date_of_expiry': self.insurance_date_of_expiry
            })
            business_doc.save()
            # frappe.msgprint(f'{self.name} has been added to the Business Vehicles of {self.business_owner}')


    def handle_personal_owner_activation(self):
        # Ensure the car is not part of any other business or personnel
        self.delete_from_business_vehicles(None, self.name)
        self.delete_from_personnel_vehicles(None, self.name)

        personnel_doc = frappe.get_doc('Personnel', self.personal_owner)
        existing_vehicle = next((vehicle for vehicle in personnel_doc.personnel_vehicles if vehicle.license_plate_number == self.name), None)

        if existing_vehicle:
            frappe.msgprint(f'{self.name} is already in the Personnel Vehicles of {self.personal_owner}')
        else:
            personnel_doc.append('personnel_vehicles', {
                'license_plate_number': self.name,
                'mulkiya_number': self.mulkiya_number,
                'mulkiya_date_of_issue': self.mulkiya_date_of_issue,
                'mulkiya_date_of_expiry': self.mulkiya_date_of_expiry,
                'insurance_date_of_issue': self.policy_start_date,
                'insurance_date_of_expiry': self.insurance_date_of_expiry
            })
            personnel_doc.save()
            # frappe.msgprint(f'{self.name} has been added to the Personnel Vehicles of {self.personal_owner}')


    def delete_from_business_vehicles(self, business_name, vehicle_name):
        if business_name:
            business_docs = [frappe.get_doc('Business', business_name)]
        else:
            business_docs = frappe.get_all('Business', fields=['name'])

        for business in business_docs:
            business_doc = frappe.get_doc('Business', business.name)
            existing_vehicle = next((vehicle for vehicle in business_doc.business_vehicles if vehicle.license_plate_number == vehicle_name), None)
            if existing_vehicle:
                business_doc.get('business_vehicles').remove(existing_vehicle)
                reset_child_table_indices(business_doc, 'business_vehicles')
                business_doc.save()
                # frappe.msgprint(f'{vehicle_name} has been removed from the Business Vehicles childtable of {business_doc.name}')

    def delete_from_personnel_vehicles(self, personal_name, vehicle_name):
        if personal_name:
            personnel_docs = [frappe.get_doc('Personnel', personal_name)]
        else:
            personnel_docs = frappe.get_all('Personnel', fields=['name'])

        for personnel in personnel_docs:
            personnel_doc = frappe.get_doc('Personnel', personnel.name)
            existing_vehicle = next((vehicle for vehicle in personnel_doc.personnel_vehicles if vehicle.license_plate_number == vehicle_name), None)
            if existing_vehicle:
                personnel_doc.get('personnel_vehicles').remove(existing_vehicle)
                reset_child_table_indices(personnel_doc, 'personnel_vehicles')
                personnel_doc.save()
                # frappe.msgprint(f'{vehicle_name} has been removed from the Personnel Vehicles childtable of {personnel_doc.name}')



@frappe.whitelist()
def deactivate_vehicle(vehicle):
	if vehicle and frappe.db.exists('Car and Carrier', vehicle):
		doc = frappe.get_doc('Car and Carrier', vehicle)
		if doc.active:
			doc.active = 0
			doc._deactivating = True 
			doc.save()
			return f'{doc.get_title()} Has Been Deactivated'
		else:
			return f'{doc.get_title()} Already Deactivated!'

