import { LightningElement, track, wire } from 'lwc';
import getCases from '@salesforce/apex/updateCaseController.getCases';

const columns = [
    { label:'Case Number', fieldName: 'caseLink', type: 'url', sortable:true, typeAttributes: {label: {fieldName: 'CaseNumber'}, tooltip:'Go to detail page', target: '_blank'}},
    { label: 'Type', fieldName: 'Type', type: 'text', sortable:true },
    { label: 'Status', fieldName: 'Status', type: 'text', sortable:true, cellAttributes:{  
        class:{  
            fieldName: `statusModified`
        },
        alignment: `left`
    } },
    { label: 'Origin', fieldName: 'Origin', type: 'text' , sortable:true},
    { label: 'Priority', fieldName: 'Priority', type: 'text', sortable:true, cellAttributes: { class:{  fieldName: `priorityModified` } , alignment: 'left' } },
    { label: 'Close Date', fieldName: 'ClosedDate', type: 'date', sortable:true,typeAttributes:{timeZone:'UTC', year:'numeric', month:'numeric', day:'numeric'}},
];
export default class UpdateMultipleCases extends LightningElement {
    error;
    columns = columns;
    allRecords; //All Cases available for data table    
    showTable = false; //Used to render table after we get the data from apex controller    
    recordsToDisplay = []; //Records to be displayed on the page
    rowNumberOffset; //Row number
    preSelected = [];
    selectedRows;
    
    @wire(getCases)
    wopps({error,data}){
        if(data){
            let records = [];
            for(let i=0; i<data.length; i++){
                let record = {};
                record.rowNumber = ''+(i+1);
                record.caseLink = '/'+data[i].Id;                
                record = Object.assign(record, data[i]);                
                records.push(record);
            }
            this.allRecords = records;
            this.showTable = true;
        }else{
            this.error = error;
        }       
    }
    //Capture the event fired from the paginator component
    handlePaginatorChange(event){
        this.recordsToDisplay = event.detail.recordsToDisplay;
        this.preSelected = event.detail.preSelected;
        if(this.recordsToDisplay && this.recordsToDisplay > 0){
            this.rowNumberOffset = this.recordsToDisplay[0].rowNumber-1;
        }else{
            this.rowNumberOffset = 0;
        } 
    }    

    getSelectedRows(event) {
        const selectedRows = event.detail.selectedRows;
        let selectedRecordIds = [];
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            console.log(selectedRows[i].Id);
            selectedRecordIds.push(selectedRows[i].Id);
        }     
        this.template.querySelector('c-lwc-datatable-utility').handelRowsSelected(selectedRecordIds);        
    }  
 
    handleAllSelectedRows(event) {
        this.selectedRows = [];
        const selectedItems = event.detail;          
        let items = [];
        selectedItems.forEach((item) => {
            this.showActionButton = true;
            console.log(item);
            items.push(item);
        });
        this.selectedRows = items;  
        console.log(this.selectedRows);        
    } 

    
    changeStyle() {
        //Generate Dynamic Values
        let mdata = [];
        this.allRecords.forEach(ele => {
            if(ele['Priority']){
                ele.priorityModified = ele.Priority === 'High' ? 'slds-text-color_error':'slds-text-color_success';            
            }  
            
            if(ele['Status']){
                ele.statusModified = ele.Status === 'Closed' ? `slds-is-edited`:``;            
            }              
            mdata.push(ele);
        });       
        this.allRecords = mdata;
        this.template.querySelector('c-lwc-datatable-utility').setRecordsOnPage(); 
    }      




} 