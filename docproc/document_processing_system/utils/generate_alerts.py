import frappe
from frappe.utils import nowdate, add_days, getdate, date_diff

class DocumentAlertManager:
    def __init__(self):
        self.today = getdate(nowdate())
        self.alert_period = self.get_alert_period()
        self.additional_alert_period = self.get_additional_alert_period()
        self.next_alert_period_days = add_days(self.today, self.alert_period)
        self.next_extended_days = add_days(self.next_alert_period_days, self.additional_alert_period)
        self.personnel_document_types = self.get_personnel_document_types()
        self.business_document_types = self.get_business_document_types()
        self.vehicle_document_types = self.get_vehicle_document_types()
        self.processed_documents = set()  # Track processed documents

    def get_alert_period(self):
        # Check Legal Document first
        legal_doc = frappe.get_value("Legal Document", None, "alert_period")
        if legal_doc:
            return int(legal_doc)
        
        # Fall back to ClearDocs Settings
        settings = frappe.get_single("ClearDocs Settings")
        return int(settings.alert_period)

    def get_additional_alert_period(self):
        # Check Legal Document first
        legal_doc = frappe.get_value("Legal Document", None, "additional_alert_period")
        if legal_doc:
            return int(legal_doc)
        
        # Fall back to ClearDocs Settings
        settings = frappe.get_single("ClearDocs Settings")
        return int(settings.additional_alert_period)

    def get_personnel_document_types(self):
        return {
            "Driving Licence": [{"document_id": "driving_licence_id", "date_of_issue": "driving_licence_date_of_issue", "date_of_expiry": "driving_licence_date_of_expiry"}],
            "VISA": [{"document_id": "visa_id", "date_of_issue": "visa_date_of_issue", "date_of_expiry": "visa_date_of_expiry"}],
            "Passport": [{"document_id": "passport_id", "date_of_issue": "passport_date_of_issue", "date_of_expiry": "passport_date_of_expiry"}],
            "Health Insurance": [{"document_id": "health_insurance_card_id", "date_of_issue": "health_insurance_date_of_issue", "date_of_expiry": "health_insurance_date_of_expiry"}],
            "Work Permit": [{"document_id": "labor_card_id", "date_of_issue": "labor_card_date_of_issue", "date_of_expiry": "labor_card_date_of_expiry"}],
            "Employment Insurance": [{"document_id": "iloea", "date_of_expiry": "iloea_date_of_expiry"}],
            "Emirates Card": [{"document_id": "emirates_card_id", "date_of_issue": "emirates_card_date_of_issue", "date_of_expiry": "emirates_card_date_of_expiry"}],
        }

    def get_business_document_types(self):
        return {
            "Company Commercial License": [{"document_id": "licence_number", "date_of_issue": "licence_issue_date", "date_of_expiry": "licence_expiry_date"}],
            "Civil Defence Certificate": [{"document_id": "certificate_id", "date_of_issue": "matafi_issue_date", "date_of_expiry": "matafi_expiry_date"}],
            "Immigration Establishment Card": [{"document_id": "iec_card_number", "date_of_issue": "iec_issue_date", "date_of_expiry": "iec_expiry_date"}],
            "Labor Establishment Card": [{"document_id": "lec_number", "date_of_issue": "lec_issue_date", "date_of_expiry": "lec_expiry_date"}],
            "E Channel": [{"document_id": "E-Channel", "date_of_expiry": "e_channel_expiry_date"}]
        }

    def get_vehicle_document_types(self):
        return {
            "Mulkiya": [{"document_id": "mulkiya_number", "date_of_issue": "mulkiya_date_of_issue", "date_of_expiry": "mulkiya_date_of_expiry"}],
            "Vehicle Insurance": [{"document_id": "policy_number", "date_of_issue": "policy_start_date", "date_of_expiry": "insurance_date_of_expiry"}]
        }

    def create_alert(self, alert_type, entity_id, document_type, document_id, date_of_issue=None,
            date_of_expiry=None, personnel_business_owner=None, personnel_primary_owner=None,
            vehicle=None):
        try:
            if frappe.db.exists(
            "Alert",
            {
                "document_type": document_type,
                "document_id": document_id,
                "date_of_expiry": date_of_expiry
            }
        ):
                return None
            
            
            alert_doc = frappe.new_doc("Alert")
            
            # Set basic fields
            alert_doc.alert_type = alert_type
            alert_doc.document_type = document_type
            alert_doc.document_id = document_id
            alert_doc.date_of_issue = date_of_issue
            alert_doc.date_of_expiry = date_of_expiry
            alert_doc.status = "Open"  # Set default status
            
            # Calculate expires_in if expiry date is provided
            if date_of_expiry:
                alert_doc.expires_in = date_diff(getdate(date_of_expiry), self.today)
            
            # Set entity-specific fields based on alert_type
            if alert_type == "Business":
                alert_doc.business = entity_id
                alert_doc.bill_to = entity_id
            elif alert_type == "Personnel":
                alert_doc.personnel = entity_id
                alert_doc.personnel_business_owner = personnel_business_owner
                alert_doc.personnel_primary_owner = personnel_primary_owner
                alert_doc.bill_to = personnel_business_owner or personnel_primary_owner
            elif alert_type == "Vehicle":
                alert_doc.vehicle = vehicle.get("license_plate_number")
                if personnel_business_owner:
                    alert_doc.vehicle_business_owner = personnel_business_owner
                if personnel_primary_owner:
                    alert_doc.vehicle_personnel_owner = personnel_primary_owner
                alert_doc.bill_to = personnel_business_owner or personnel_primary_owner
            
            # Save the alert
            alert_doc.save(ignore_permissions=True)
            return alert_doc
            
        except Exception as e:
            frappe.log_error(
                message=f"Error creating alert: {str(e)}\nAlert Type: {alert_type}\nDocument Type: {document_type}",
                title="Alert Creation Error"
            )
            raise

    def process_document(self, entity_doc, doc_type, fields, alert_type,
                        personnel_business_owner=None, personnel_primary_owner=None):
        """
        Process a single document and create an alert if it's expiring.
        """
        has_expiring = False
        
        for field_set in fields:
            expiry_field = field_set.get("date_of_expiry")
            if not entity_doc.get(expiry_field):
                continue

            document_id_field = field_set.get("document_id")
            document_id = entity_doc.get(document_id_field)
            if not document_id or document_id in self.processed_documents:
                continue

            self.processed_documents.add(document_id)
            expiry_date = getdate(entity_doc.get(expiry_field))
            
            if self.today <= expiry_date <= self.next_extended_days:
                date_of_issue_field = field_set.get("date_of_issue")
                date_of_issue = entity_doc.get(date_of_issue_field) if date_of_issue_field else None
                
                # For vehicle alerts, pass the entire vehicle document
                vehicle_param = entity_doc if alert_type == "Vehicle" else None
                
                self.create_alert(
                    alert_type=alert_type,
                    entity_id=entity_doc.name,
                    document_type=doc_type,
                    document_id=document_id,
                    date_of_issue=date_of_issue,
                    date_of_expiry=expiry_date,
                    personnel_business_owner=personnel_business_owner,
                    personnel_primary_owner=personnel_primary_owner,
                    vehicle=vehicle_param
                )
                
                if self.today <= expiry_date <= self.next_alert_period_days:
                    has_expiring = True

        return has_expiring
    
    
    def process_personnel(self, personnel):
        """Process all documents for a personnel"""
        # No need to fetch doc again as we have all fields
        for doc_type, fields in self.personnel_document_types.items():
            personnel_business_owner = personnel["business"] if personnel["personnel_type"] == "Business Staff" else None
            personnel_primary_owner = personnel["primary_personnel"] if personnel["personnel_type"] == "Dependent" else personnel["name"]
            
            # Check for expiring documents before processing
            has_expiring = self._check_expiring_fields(personnel, fields)
            if has_expiring:
                self.process_document(
                    entity_doc=personnel,
                    doc_type=doc_type,
                    fields=fields,
                    alert_type="Personnel",
                    personnel_business_owner=personnel_business_owner,
                    personnel_primary_owner=personnel_primary_owner
                )

    def process_business(self, business):
        """Process all documents for a business"""
        # No need to fetch doc again as we have all fields
        for doc_type, fields in self.business_document_types.items():
            # Check for expiring documents before processing
            has_expiring = self._check_expiring_fields(business, fields)
            if has_expiring:
                self.process_document(
                    entity_doc=business,
                    doc_type=doc_type,
                    fields=fields,
                    alert_type="Business"
                )

    def process_vehicle(self, vehicle):
        """Process all documents for a vehicle"""
        vehicle_doc = frappe.get_doc("Car and Carrier", vehicle.name)
        
        # Get owner information
        owner_type = vehicle_doc.owner_type
        owner_info = None
        
        if owner_type == "Personnel":
            owner_info = frappe.get_doc("Personnel", vehicle_doc.personal_owner)
            personnel_business_owner = owner_info.business if owner_info.personnel_type == "Business Staff" else None
            personnel_primary_owner = owner_info.name
        else:  # Business
            owner_info = frappe.get_doc("Business", vehicle_doc.business_owner)
            personnel_business_owner = owner_info.name
            personnel_primary_owner = None

        # Process each document type
        for doc_type, fields in self.vehicle_document_types.items():
            # Check for expiring documents before processing
            has_expiring = self._check_expiring_fields(vehicle_doc, fields)
            if has_expiring:
                self.process_document(
                    entity_doc=vehicle_doc,
                    doc_type=doc_type,
                    fields=fields,
                    alert_type="Vehicle",
                    personnel_business_owner=personnel_business_owner,
                    personnel_primary_owner=personnel_primary_owner
                )

    def _check_expiring_fields(self, doc, fields):
        """Helper method to check if any fields are expiring"""
        for field_set in fields:
            expiry_field = field_set.get("date_of_expiry")
            expiry_date = doc.get(expiry_field)
            
            if expiry_date and self.today <= getdate(expiry_date) <= self.next_extended_days:
                return True
        return False

    def check_expiring_documents(self):
        """Main function to check all expiring documents"""
        # Process Personnel documents with explicit expiry date check
        personnel_query = """
            SELECT 
                name,
                full_name,
                active,
                personnel_type,
                business,
                primary_personnel,
                driving_licence_id,
                driving_licence_date_of_issue,
                driving_licence_date_of_expiry,
                visa_id,
                visa_date_of_issue,
                visa_date_of_expiry,
                passport_id,
                passport_date_of_issue,
                passport_date_of_expiry,
                health_insurance_card_id,
                health_insurance_date_of_issue,
                health_insurance_date_of_expiry,
                labor_card_id,
                labor_card_date_of_issue,
                labor_card_date_of_expiry,
                iloea,
                iloea_date_of_expiry,
                emirates_card_id,
                emirates_card_date_of_issue,
                emirates_card_date_of_expiry
            FROM `tabPersonnel`
            WHERE active = 1
            AND (
                driving_licence_date_of_expiry BETWEEN %(today)s AND %(extended_date)s
                OR visa_date_of_expiry BETWEEN %(today)s AND %(extended_date)s
                OR passport_date_of_expiry BETWEEN %(today)s AND %(extended_date)s
                OR health_insurance_date_of_expiry BETWEEN %(today)s AND %(extended_date)s
                OR labor_card_date_of_expiry BETWEEN %(today)s AND %(extended_date)s
                OR iloea_date_of_expiry BETWEEN %(today)s AND %(extended_date)s
                OR emirates_card_date_of_expiry BETWEEN %(today)s AND %(extended_date)s
            )
        """
        
        # Process Business documents with explicit expiry date check
        business_query = """
            SELECT 
                name,
                company_name,
                active,
                licence_number,
                licence_issue_date,
                licence_expiry_date,
                certificate_id,
                matafi_issue_date,
                matafi_expiry_date,
                iec_card_number,
                iec_issue_date,
                iec_expiry_date,
                lec_number,
                lec_issue_date,
                lec_expiry_date,
                e_channel_username,
                e_channel_expiry_date
            FROM `tabBusiness`
            WHERE active = 1
            AND (
                licence_expiry_date BETWEEN %(today)s AND %(extended_date)s
                OR matafi_expiry_date BETWEEN %(today)s AND %(extended_date)s
                OR iec_expiry_date BETWEEN %(today)s AND %(extended_date)s
                OR lec_expiry_date BETWEEN %(today)s AND %(extended_date)s
                OR e_channel_expiry_date BETWEEN %(today)s AND %(extended_date)s
            )
        """
        
        # Process Vehicle documents with explicit expiry date check
        vehicle_query = """
            SELECT 
                name,
                active,
                license_plate_number,
                owner_type,
                personal_owner,
                business_owner,
                mulkiya_number,
                mulkiya_date_of_issue,
                mulkiya_date_of_expiry,
                policy_number,
                policy_start_date,
                insurance_date_of_expiry
            FROM `tabCar and Carrier`
            WHERE active = 1
            AND (
                mulkiya_date_of_expiry BETWEEN %(today)s AND %(extended_date)s
                OR insurance_date_of_expiry BETWEEN %(today)s AND %(extended_date)s
            )
        """
        
        params = {
            'today': self.today,
            'extended_date': self.next_extended_days
        }
        
        # Process all document types with debug logging
        personnel_docs = frappe.db.sql(personnel_query, values=params, as_dict=1)
        frappe.logger().debug(f"Found {len(personnel_docs)} personnel documents to process")
        for personnel in personnel_docs:
            self.processed_documents.clear()
            self.process_personnel(personnel)

        business_docs = frappe.db.sql(business_query, values=params, as_dict=1)
        frappe.logger().debug(f"Found {len(business_docs)} business documents to process")
        for business in business_docs:
            self.processed_documents.clear()
            self.process_business(business)

        vehicle_docs = frappe.db.sql(vehicle_query, values=params, as_dict=1)
        frappe.logger().debug(f"Found {len(vehicle_docs)} vehicle documents to process")
        for vehicle in vehicle_docs:
            self.processed_documents.clear()
            self.process_vehicle(vehicle)
    
@frappe.whitelist()
def trigger_check_expiring_documents():
    manager = DocumentAlertManager()
    manager.check_expiring_documents()
    
    
# Entry point for manual triggering
if __name__ == "__main__":
   trigger_check_expiring_documents()