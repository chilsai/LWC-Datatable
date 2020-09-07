public with sharing class ContactController {

    @AuraEnabled(cacheable=true)
    public static list<Contact> getContacts(){
        throw new AuraHandledException('Forced error');
        //return [select id,FirstName, LastName, Email from contact ];
    }

}
