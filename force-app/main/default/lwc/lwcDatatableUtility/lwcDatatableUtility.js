import { LightningElement, api } from 'lwc';
const DELAY = 300;
const recordsPerPage = [10,25,50,75,100];
const pageNumber = 1;
const showIt = 'visibility:visible';
const hideIt = 'visibility:hidden'; //visibility keeps the component space, but 

export default class LwcDatatableUtility extends LightningElement {
    // Input Attributes from Parent Componant
    @api keyField;
    @api showSearchBox = false; //Show/hide search box; valid values are true/false
    @api showPagination; //Show/hide pagination; valid values are true/false
    @api pageSizeOptions = recordsPerPage; //Page size options; valid values are array of integers
    @api totalRecords; //Total no.of records; valid type is Integer
    @api records; //All records available in the data table; valid type is Array
    @api maxRowSelection; //All records available in the data table; valid type is Array 
    @api columns = []; //Records to be displayed on the page

    pageSize; //No.of records to be displayed per page
    totalPages; //Total no.of pages
    pageNumber = pageNumber; //Page number
    searchKey; //Search Input
    controlPagination = showIt;
    controlPrevious = hideIt; //Controls the visibility of Previous page button
    controlNext = showIt; //Controls the visibility of Next page button
    rowNumberOffset; //Row number
    preSelected; //preSelectedOnDisplay
    recordsToDisplay = []; //Records to be displayed on the page
    
    filteredRecords = []; //Filtered records available in the data table; valid type is Array
    selectedRecords = []; //OverallSelected records  in the data table; valid type is Array 
    pageSelectedRecords = []; //Page Selected rows  in the data table; valid type is Array
    filtredNum; //Total no.of Filtered records; valid type is Integer
    totalSelected = 0;
    refreshCurrentData;
    //SORT
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;    

    //Called after the component finishes inserting to DOM
    connectedCallback() {
        if(this.pageSizeOptions && this.pageSizeOptions.length > 0) 
            this.pageSize = this.pageSizeOptions[0];
        else{
            this.pageSize = this.totalRecords;
            this.showPagination = false;
        }
        this.controlPagination = this.showPagination === false ? hideIt : showIt;
        this.filteredRecords = this.records; 
        this.filtredNum = this.totalRecords;
        this.setRecordsToDisplay();
    }

    handleRecordsPerPage(event){
        this.pageSize = event.target.value;
        this.setRecordsToDisplay();
    }

    handlePageNumberChange(event){
        if(event.keyCode === 13){
            this.pageNumber = event.target.value;
            this.setRecordsToDisplay();
        }
    }
   
    previousPage(){
        this.pageNumber = this.pageNumber-1;
        this.setRecordsToDisplay();
    }
    nextPage(){
        this.pageNumber = this.pageNumber+1;
        this.setRecordsToDisplay();
    }

    setRecordsToDisplay(){
        this.recordsToDisplay = [];
        if(!this.pageSize)
            this.pageSize = this.filtredNum;

        this.totalPages = Math.ceil(this.filtredNum/this.pageSize);

        this.setPaginationControls();

        for(let i=(this.pageNumber-1)*this.pageSize; i < this.pageNumber*this.pageSize; i++){
            if(i === this.filtredNum) break;
            this.recordsToDisplay.push(this.filteredRecords[i]);
        }
        this.preSelected = [];
        this.selectedRecords.forEach((item) => {
            if(item.selected)
                this.preSelected.push(item.Id);
        })       
        let paginatedRecords = new Object();
        paginatedRecords.recordsToDisplay = this.recordsToDisplay;
        paginatedRecords.preSelected = this.preSelected;
        if(this.maxRowSelection === '1' ){
            this.totalSelected = 0;
        }    
        if(this.selectedRecords && this.selectedRecords.length > 0){
            this.refreshCurrentData = true;
        }                                      
    }

    setPaginationControls(){
        //Control Pre/Next buttons visibility by Total pages
        if(this.totalPages === 1){
            this.controlPrevious = hideIt;
            this.controlNext = hideIt;
        }else if(this.totalPages > 1){
           this.controlPrevious = showIt;
           this.controlNext = showIt;
        }
        //Control Pre/Next buttons visibility by Page number
        if(this.pageNumber <= 1){
            this.pageNumber = 1;
            this.controlPrevious = hideIt;
        }else if(this.pageNumber >= this.totalPages){
            this.pageNumber = this.totalPages;
            this.controlNext = hideIt;
        }
        //Control Pre/Next buttons visibility by Pagination visibility
        if(this.controlPagination === hideIt){
            this.controlPrevious = hideIt;
            this.controlNext = hideIt;
        }
    }

    handleKeyChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        if(searchKey){
            this.delayTimeout = setTimeout(() => {
                //this.controlPagination = hideIt;
                this.setPaginationControls();

                this.searchKey = searchKey;
                //Use other field name here in place of 'Name' field if you want to search by other field
                //this.recordsToDisplay = this.records.filter(rec => rec.includes(searchKey));
                //Search with any column value (Updated as per the feedback)
                this.filteredRecords = this.records.filter(rec => JSON.stringify(rec).includes(searchKey));
                this.filtredNum = this.filteredRecords.length; 
                this.setRecordsToDisplay();
            }, DELAY);
        }else{
            this.filteredRecords = this.records; 
            this.filtredNum = this.totalRecords;            
            this.controlPagination = showIt;
            this.setRecordsToDisplay();
        }        
    }

    handelRowsSelected(selectedRows) {
        console.log(selectedRows.length);
        this.totalSelected = 0;
        this.pageSelectedRecords = [];
        if(this.maxRowSelection != '1' && this.recordsToDisplay && 
            this.recordsToDisplay.length > 0 && 
            ((selectedRows.length === 0 && !this.refreshCurrentData) || selectedRows.length > 0) ){                       
            this.recordsToDisplay.forEach((item)=>{                
                var row = new Object(); 
                row.Id = item.Id;                
                if(selectedRows.includes(item.Id)){
                    row.selected = true;
                }else{
                    row.selected = false;
                }
                this.pageSelectedRecords.push(row) ;
            });                       
        }
        // To store previous row Selection
        if(this.selectedRecords.length == 0 ){
            this.selectedRecords = this.pageSelectedRecords;
        }
        this.selectedRecords = this.mergeObjectArray(this.selectedRecords, this.pageSelectedRecords, "Id");          
        if(this.maxRowSelection === '1' && selectedRows && selectedRows.length > 0){
            this.totalSelected = 1;
        }else{
            let i=0;
            this.selectedRecords.forEach(item => {
                if(item.selected){
                    i++;
                    this.totalSelected = i;
                }
            }) 
            //this.totalSelected = this.totalSelected ===1 && selectedRows.length ===0? 0: this.totalSelected;           
        }
        const filterSelected = this.selectedRecords.filter(({ selected }) => selected === true );
        this.dispatchEvent(new CustomEvent('setselectedrecords', {detail: filterSelected})); //Send records to display on table to the parent component
        this.refreshCurrentData = false;
    }

    mergeObjectArray(firstArray, secondArray, prop){
        var reduced =  firstArray.filter( aitem => ! secondArray.find ( bitem => aitem[prop] === bitem[prop]) )
        //let arr3 = arr1.map((item, i) => Object.assign({}, item, arr2[i]));
        return reduced.concat(secondArray);
    }    

    getSelectedRows(event) {
        const selectedRows = event.detail.selectedRows;
        let selectedRecordIds = [];
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            console.log(selectedRows[i].Id);
            selectedRecordIds.push(selectedRows[i].Id);
        }     
        this.handelRowsSelected(selectedRecordIds);        
    }      

    handelSort(event){        
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.filteredRecords];
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.filteredRecords = cloneData;  
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;        
        this.setRecordsToDisplay();
    } 

    sortBy(field, reverse, primer) {
        const key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }    
}
