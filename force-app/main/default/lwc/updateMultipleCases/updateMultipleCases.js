import { LightningElement, track, wire } from 'lwc';
import getCases from '@salesforce/apex/updateCaseController.getCases';

const columns = [
    { label:'Case Number', fieldName: 'caseLink', type: 'url', sortable:true, typeAttributes: {label: {fieldName: 'CaseNumber'}, tooltip:'Go to detail page', target: '_blank'}},
    { label: 'Type', fieldName: 'Type', type: 'text', sortable:true },
    { label: 'Status', fieldName: 'Status', type: 'text', sortable:true },
    { label: 'Origin', fieldName: 'Origin', type: 'text' , sortable:true},
    { label: 'Priority', fieldName: 'Priority', type: 'text', sortable:true, cellAttributes: { alignment: 'left' } },
    { label: 'Close Date', fieldName: 'ClosedDate', type: 'date', sortable:true,typeAttributes:{timeZone:'UTC', year:'numeric', month:'numeric', day:'numeric'}},
];
export default class UpdateMultipleCases extends LightningElement {
    @track error;
    @track columns = columns;
    @track allRecords; //All opportunities available for data table    
    @track showTable = false; //Used to render table after we get the data from apex controller    
    @track recordsToDisplay = []; //Records to be displayed on the page
    @track rowNumberOffset; //Row number
    @track preSelected = [];
    @track selectedRows = [];
    
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

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        this.template.querySelector('c-lwc-datatable-utility').handelSort(event);        
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
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
        const selectedRows = event.detail;  
        let items = [];
        selectedRows.forEach((item) => {
            this.showActionButton = true;
            console.log(item);
            items.push(item);
            if(item.selected){
                this.selectedRows.push(item);
            }
        });
        //this.selectedRows = selectedRows;
        console.log(selectedRows);
    } 

} 