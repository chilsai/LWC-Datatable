import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import OWNER_NAME_FIELD from '@salesforce/schema/Account.Owner.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
  
export default class WireLDS extends LightningElement {
  @api recordId;
  
  @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD, INDUSTRY_FIELD], optionalFields: [PHONE_FIELD, OWNER_NAME_FIELD] })
  account;
  
  get name() {
    return getFieldValue(this.account.data, NAME_FIELD);
  }
  
  get phone() {
    return getFieldValue(this.account.data, PHONE_FIELD);
  }
  
  get industry(){
    return getFieldValue(this.account.data, INDUSTRY_FIELD);
  }
  
  get owner() {
    return getFieldValue(this.account.data, OWNER_NAME_FIELD);
  }
}