public with sharing class ParentIdChildRecordsController {

    public class finalDataWrapper{
        @AuraEnabled public List<Id> childRecordIds;
        @AuraEnabled public List<String> fieldApiNames;
        
    }

    @AuraEnabled
    public static finalDataWrapper getChildRecords(String parentId, String childObjectName, String childRelationshipFieldName, String fieldSetName) {
        // List to store child records
        List<SObject> childRecords = new List<SObject>();
        List<String> fieldNames = new List<String>();
        List<Id> childRecordIds = new List<Id>();
        finalDataWrapper wrapper1 = new finalDataWrapper();
        System.debug('inside get child records ' );

        // Get the child object's schema
        Schema.SObjectType childSObjectType = Schema.getGlobalDescribe().get(childObjectName);
        Schema.DescribeSObjectResult childDescribe = childSObjectType.getDescribe();
        Map<String, Schema.FieldSet> fieldSets = childDescribe.fieldSets.getMap();
        Schema.FieldSet fieldSet = fieldSets.get(fieldSetName);
        for (Schema.FieldSetMember fieldSetMember : fieldSet.getFields()) {
            fieldNames.add(fieldSetMember.getFieldPath());
        }
        //fieldNames.add('Id'); // adding ID in fieldset

        wrapper1.fieldApiNames = fieldNames;

        try {
            // Build a dynamic SOQL query
            String query = 'SELECT Id FROM ' + childObjectName + ' WHERE ' + childRelationshipFieldName + ' = :parentId';
            
            // Execute the dynamic query and retrieve child records
            childRecords = Database.query(query);

            for(SObject obj : childRecords){
                childRecordIds.add(obj.Id);
            }
            wrapper1.childRecordIds = childRecordIds;

        } catch (Exception e) {
            // Handle any exceptions
            System.debug('Error retrieving child records: ' + e.getMessage());
        }

        return wrapper1;
    }
    
        @AuraEnabled
        public static wrapperone getChildRelationshipsFieldSets(String childObjectName, String sObjectType) {
            
                
                return getChildRelationships(sObjectType, childObjectName);
            
        }
        
        // Method to get child relationships for a given SObject type
        public static wrapperone getChildRelationships(String sObjectName, String childObjectName) {
            List<String> childRelationshipFieldData1 = new List<String>();
            //List<String> fieldSetNames = new List<String>();
            wrapperone wrap = new wrapperone();
            
            // Get the SObjectType based on the provided SObject name
            Schema.SObjectType sObjectType = Schema.getGlobalDescribe().get(sObjectName);
            Schema.SObjectType ChildSObjectType = Schema.getGlobalDescribe().get(childObjectName);
            
            //getting field set names
            if (ChildSObjectType != null) {
                Schema.DescribeSObjectResult describeResult = ChildSObjectType.getDescribe();
				Map<String, Schema.FieldSet> fieldSets = describeResult.fieldSets.getMap();
                system.debug('map fieldSets'+fieldSets.keySet());
                wrap.fieldSetNames = new List<String>(fieldSets.keySet());
            }
            
            
            if (sObjectType != null) {
                // Get the describe result of the SObject
                Schema.DescribeSObjectResult describeResult = sObjectType.getDescribe();
                
                // Get all child relationships
                for (Schema.ChildRelationship childRel : describeResult.getChildRelationships()) {
                    //childRelationshipNames.add(childRel.getChildSObject() + ' ... ' + childRel.getField());
                    //system.debug('child obj'+childRel.getChildSObject());
                    if (String.valueOf(childRel.getChildSObject()) == childObjectName) {
                        system.debug('child obj'+String.valueOf(childRel.getField()));
                        childRelationshipFieldData1.add(String.valueOf(childRel.getField()));
                    }
            	}
                wrap.childRelationshipFieldData = childRelationshipFieldData1;
            }
            
            return wrap;
        }

        public class wrapperone {

            @AuraEnabled public List<String> childRelationshipFieldData;
            @AuraEnabled public List<String> fieldSetNames;
            

        }
    
}