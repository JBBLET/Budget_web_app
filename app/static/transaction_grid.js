
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function submitform() {
    var frm = document.getElementById('transaction_form');
    frm.submit();
    frm.reset();
    await sleep(1000);
    update_transaction_tables();
    return false; 
 }

function remove_options(selectElement) {
    var i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }

async function get_transaction(selectElement) {
    var response = await fetch("/transaction/api/category",   {method:'POST',
                                                                headers:{"Content-Type":"application/json"},
                                                                body:JSON.stringify({'type':selectElement.value})});
    console.log(response);
    var data = response.json();
    return data;
};

async function update_category_list(){
        var category_selectElement = document.getElementById("category_type_selected");
        var type_selectElement = document.getElementById("budget_type_selected");
        remove_options(category_selectElement);
        if (type_selectElement.value!='Type') {
            var categories = await get_transaction(type_selectElement);
            categories.data.forEach(category => {
                var newOption = document.createElement("option");
                console.log(category);
                newOption.value = category;
                newOption.text = category;
                category_selectElement.appendChild(newOption);
            });
    };
    };

async function deleteEntry(entry_id){
    var response = await fetch("/transaction/api/data_delete",   {method:'POST',
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({"transaction_id":entry_id})});

    console.log(response);
    update_transaction_tables();
    return true
}
const editableCellAttributes = (data, row, col) => {
    if (row) {
        return {contentEditable: 'true', 'data-element-id': row.cells[0].data};
        }
    else {
        return {};
        }
    };

const tableDiv_transaction = document.getElementById("Transaction");    
var grid_transaction = new gridjs.Grid({
        columns: [
            { id: 'id', name: 'Transaction_id', hidden:true},
            { id: 'date', name : 'Date'},
            { id: 'type',name: 'Type'},
            { id: 'category',name: 'Category'},
            { id: 'amount',name: 'Amount'},
            { id: 'actions', name:'Actions', formatter:(cell, row)=>{return gridjs.h('button', {
                onClick: () => {
                    deleteEntry(row.cells[0].data)}
            }, 'Delete');}}
        ],
        style: {
            td: {
              border: '1px solid #ccc'
            },
            table: {
              'font-size': '12px'
            }
          },
        server: {url : '/transaction/api/data',
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
            then :result => result.data}}).render(tableDiv_transaction);


function update_transaction_tables() {
    grid_transaction.updateConfig({server: {url : '/transaction/api/data',
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
    then :result => result.data}}).forceRender(tableDiv_transaction);
              }






































