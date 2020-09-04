---
description: >-
  Generic Data table with Pagination, Row Selection across Pages and Table
  Search, Static Headers
---

# Salesforce LWC Data Table

Generic Data table for LWC

**Step 1**: Deploy/Create [lwcDatatableUtility](https://github.com/chilsai/lwcDatatable/tree/master/force-app/main/default/lwc/lwcDatatableUtility) in your Org.

**Step 2**: To use lwcDataTableUtility in your Component 

* Declare below variables to Pass data to [lwcDatatableUtility](https://github.com/chilsai/lwcDatatable/tree/master/force-app/main/default/lwc/lwcDatatableUtility)
  * 

```text
<c-lwc-datatable-utility records={allRecords} 
total-records={allRecords.length} 
columns = {columns}
key-field="Id"
show-search-box="true"            
max-row-selection={allRecords.length}
onpaginatorchange={handlePaginatorChange}
onsetselectedrecords={handleAllSelectedRows}>
</c-lwc-datatable-utility>    
```







![Data Table in LWC ](.gitbook/assets/demo-v1.gif)



