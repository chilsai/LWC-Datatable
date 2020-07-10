public with sharing class updateCaseController {
    public updateCaseController() {

    }
    @AuraEnabled(cacheable=true)
    public static list<Case>  getCases(){
        return [SELECT id, CaseNumber, Type,Status,   Origin, Priority, Contact.Name, ClosedDate FROM Case];
    }
}
