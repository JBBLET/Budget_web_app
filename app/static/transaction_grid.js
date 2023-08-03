
function remove_options(selectElement) {
    var i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }

async function getPost(selectElement) {
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
            var categories = await getPost(type_selectElement);
            categories.data.forEach(category => {
                var newOption = document.createElement("option");
                console.log(category);
                newOption.value = category;
                newOption.text = category;
                category_selectElement.appendChild(newOption);
        
            });
    };
    };
async function submit_transaction_form(){
    var form_transaction = document.forms["transaction_form"];
    await fetch("/transaction/api/data_input",   {method:'POST',
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(Object.fromEntries(form_transaction))});
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
            { id: 'amount',name: 'Amount','attributes': editableCellAttributes },
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

        let savedValue_income;

        tableDiv_transaction.addEventListener('focusin', ev => {
            if (ev.target.tagName === 'TD') {
                savedValue_income = ev.target.textContent;
                }
            });
    
        tableDiv_transaction.addEventListener('focusout', ev => {
            if (ev.target.tagName === 'TD') {
            if (savedValue_income !== ev.target.textContent) {
                fetch('/transaction/api/data_input', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'budget_type':'Income',
                        'category_type':ev.target.dataset.elementId,
                        'year':document.getElementById("year_selected").value,
                        'column':ev.target.dataset.columnId,
                        'input':ev.target.textContent
                    }),
                    });
                }
            savedValue_income = undefined;
                }
            });
            
        tableDiv_transaction.addEventListener('keydown', ev => {
            if (ev.target.tagName === 'TD') {
            if (ev.key === 'Escape') {
                ev.target.textContent = savedValue_transaction;
                ev.target.blur();
                }
            else if (ev.key === 'Enter') {
                ev.preventDefault();
                ev.target.blur();
                }
                }
            });

function update_transaction_tables() {
    grid_transaction.updateConfig({server: {url : '/transaction/api/data',
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
    then :result => result.data}}).forceRender(tableDiv_transaction);
              }






































