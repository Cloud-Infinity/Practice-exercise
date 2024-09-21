import { LightningElement,api } from 'lwc';
import getChildRelationshipsFieldSets from '@salesforce/apex/ParentIdChildRecordsController.getChildRelationshipsFieldSets';
import getChildRecords from '@salesforce/apex/ParentIdChildRecordsController.getChildRecords';

export default class ParentIdChildRecords extends LightningElement {
  @api recordId;
  @api objectApiName;
  @api childObjectAPIName; 
  @api childRelationAPIName ;
  @api fieldSetName ;
  //loadomplete = false;

  //childRelationships = [];
  selectedChildObjValue = "";
  relatedObjects = [
    { label: "--None--", value: "--None--" },
    { label: "Contact", value: "Contact" },
    { label: "Opportunity", value: "Opportunity" },
    { label: "Lead", value: "Lead" }
  ];
  fieldsdisable = true;
  
  relationFields = [];
  FieldsetNamesFromApex = [];
  selectedChildObjectValue = "";
  selectedFieldSetValue = '';
  selectedRelationFieldValue = "";
  childObjIds = [];
  fieldAPINames = [];
  noDataText = "";

  connectedCallback() {
    //this.getData();
    // console.log("record id", this.recordId);
    // console.log("Object name ", this.objectApiName);
    // console.log("child Object name ", this.childObjectAPIName);
    // console.log("Child relation name ", this.childRelationAPIName);
    // console.log("Fieldset name ", this.fieldSetName);
    // setTimeout(() => {
    //     this.getData();
    // }, 5000);
    
  }
  

  getData(){

    if (
        this.recordId &&
        this.childObjectAPIName != null &&
        this.childRelationAPIName != null
      ) {
        console.log("child obj val", this.childObjectAPIName);
        getChildRecords({
          parentId: this.recordId,
          childObjectName: this.childObjectAPIName,
          childRelationshipFieldName: this.childRelationAPIName,
          fieldSetName : this.fieldSetName
        })
          .then((results) => {
            console.log("records data from apex:", results);
            this.childObjIds = results.childRecordIds;
            console.log("Child record IDS:", this.childObjIds);
            if (this.childObjIds.length <= 0) {
              this.noDataText = "No records found!";
            }
  
            this.fieldAPINames = results.fieldApiNames;
            console.log("field API Names:", this.fieldAPINames);
            this.loadomplete = true;
          })
          .catch((error) => {
            console.error("Error fetching child records data:", error);
          });
      }
  }

  fetchChildRelationships() {
    if (this.recordId && this.selectedChildObjectValue != null) {
      console.log("child obj val", this.selectedChildObjectValue);
      getChildRelationshipsFieldSets({
        childObjectName: this.selectedChildObjectValue,
        sObjectType : this.objectApiName
      })
        .then((result) => {
          console.log("List from apex:", result);
          let childRelationshipFields = result.childRelationshipFieldData;
          let fieldSetNames = result.fieldSetNames;
          console.log("child realtionship line42:", childRelationshipFields);
          let tempObj = [];
          let tempObj1 = [];
          
          childRelationshipFields.forEach((element) => {
            tempObj.push({ label: element, value: element });
          });

          fieldSetNames.forEach((element) => {
            tempObj1.push({ label: element, value: element });
          });

          console.log("child realtionship names from apex:", tempObj);
          console.log("fieldset name from apex:", tempObj1);
          this.relationFields = tempObj;
          this.FieldsetNamesFromApex = tempObj1;
        })
        .catch((error) => {
          console.error("Error fetching child relationships:", error);
        });
    }
  }

  handleChildObjChange(event) {
    this.selectedRelationFieldValue = "";
    this.selectedFieldSetValue = '';
    this.relationFields = [];
    console.log("fields data in handle change:", this.relationFields);
    console.log("inside object handle change:");
    this.selectedChildObjectValue = event.detail.value; // Store selected value
    console.log("field value:", event.detail.value);
    if (this.selectedChildObjectValue === "--None--") {
      this.fieldsdisable = true;
    } else {
      this.fetchChildRelationships();
      this.fieldsdisable = false;
    }
  }

  handleRelationFieldChange(event) {
    console.log("field value:", event.detail.value);
    this.selectedRelationFieldValue = event.detail.value;
  }

  handleFieldSetChange(event){
    console.log("fieldset value:", event.detail.value);
    this.selectedFieldSetValue =  event.detail.value;

  }

  handleClick() {
    if (
      this.recordId &&
      this.selectedChildObjectValue != null &&
      this.selectedRelationFieldValue != null
    ) {
      console.log("child obj val", this.selectedChildObjectValue);
      getChildRecords({
        parentId: this.recordId,
        childObjectName: this.selectedChildObjectValue,
        childRelationshipFieldName: this.selectedRelationFieldValue,
        fieldSetName : this.selectedFieldSetValue
      })
        .then((results) => {
          console.log("records data from apex:", results);
          this.childObjIds = results.childRecordIds;
          console.log("Child record IDS:", this.childObjIds);
          if (this.childObjIds.length <= 0) {
            this.noDataText = "No records found!";
          }

          this.fieldAPINames = results.fieldApiNames;
          console.log("field API Names:", this.fieldAPINames);
        })
        .catch((error) => {
          console.error("Error fetching child records data:", error);
        });
    }
  }

  
}