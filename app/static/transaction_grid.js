//Create Global variables for the div and the grid
var grid_transaction;
var tableDiv_transaction;

function sleep(ms) {
    //funtion to await for update of response
    return new Promise(resolve => setTimeout(resolve, ms));
}

function styling(string){
    //funtion to stylize the content of the cells
    if (string!=''){
        return Number(string).toLocaleString();
    }
    else{
        return '';
    }
}
async function submit_form() {
    //Submit the form to update the database and the call the updating of the grid
    var frm = document.getElementById('transaction_form');
    frm.submit();
    frm.reset();
    await sleep(1000);
    update_transaction_tables();
    return false; 
 }

function remove_options(selectElement) {
    //delete the option in the select element passed to update the options based on first select
    var i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }

async function get_category(selectElement) {
    //call the server to get a list of the categories available for the selected first select
    var response = await fetch("/transaction/api/category",   {method:'POST',
                                                                headers:{"Content-Type":"application/json"},
                                                                body:JSON.stringify({'type':selectElement.value,'year':document.getElementById("year_selected").value})});
    console.log(response);
    var data = response.json();
    return data;
};

async function update_category_list(){
    //used previous functions to update the options on the second select
    var category_selectElement = document.getElementById("category_type_selected");
    var type_selectElement = document.getElementById("budget_type_selected");
    remove_options(category_selectElement);
    if (type_selectElement.value!='Type') {
        var categories = await get_category(type_selectElement);
        categories.data.forEach(category => {
            var newOption = document.createElement("option");
            console.log(category);
            newOption.value = category;
            newOption.text = category;
            category_selectElement.appendChild(newOption);
        });
};
};

async function delete_entry(entry_id){
    //function called on the push of the delete button inside the grid then delete the entry in the database
    var response = await fetch("/transaction/api/data_delete",   {method:'POST',
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({"transaction_id": entry_id})});

    console.log(response);
    update_transaction_tables();
    return true
}

function initial_setup(){
    //Intial setup function to render the grid 
    tableDiv_transaction = document.getElementById("Transaction");    
    grid_transaction = new gridjs.Grid({
        columns: [
            { id: 'id', name: 'Transaction_id', hidden: true},
            { id: 'date', name: 'Date', sort: true},
            { id: 'type', name: 'Type'},
            { id: 'category', name: 'Category'},
            { id: 'amount', name: 'Amount', formatter: (cell)=>styling(cell)},
            { id: 'actions', name: 'Actions', formatter:(cell, row)=>{return gridjs.h('button', {
                onClick: () => {
                    delete_entry(row.cells[0].data)}
            }, 'Delete');}}
        ],
        search: true,
        pagination: {
            limit: 50},
        style: {
            td: {
              border: '1px solid #ccc'
            },
            table: {
              'font-size': '12px'
            }
          },
        server: {url : '/transaction',
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
            then :result => result.data}}).render(tableDiv_transaction);
    return true
}

function update_transaction_tables() {
    //change the config to fecth the data again force render the grid
    grid_transaction.updateConfig({server: {url : '/transaction',
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
    then :result => result.data}}).forceRender(tableDiv_transaction);
              }

//call the initialization function on window load
window.onload = function() {
    initial_setup();
    }