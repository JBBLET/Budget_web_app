//Create Global variables for the div and the grid
var tableDiv_income;
var grid_income;

var tableDiv_expense;
var grid_expense;

var tableDiv_savings;
var grid_savings;

function styling(string){
    //Function to format the content of the cell in the grids
    if (string!=''){
        return Number(string).toLocaleString();
    }
    else{
        return '';
    }
}
const editableCellAttributes = (data, row, col) => {
    //Attribute to make the cell content editable
    if (row) {
        return {contentEditable: 'true', 'data-element-id': row.cells[0].data};
        }
    else {
        return {};
        }
    };

function initial_setup(){
    //Function that create the inital grids and link them to the right call to the server
    tableDiv_income = document.getElementById("Income");    
    grid_income = new gridjs.Grid({
            columns: [
                { id: 'id', name: 'Category','attributes': editableCellAttributes},
                { id: '1', name : 'Jan.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '2', name: 'Fev.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '3', name: 'Mar.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '4', name: 'Apr.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '5', name: 'May.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '6', name: 'Jun.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '7', name: 'Jul.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '8', name: 'Aug.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '9', name: 'Sep.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '10', name: 'Oct.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '11', name: 'Nov.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '12', name: 'Dec.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
            ],
            style: {
                td: {
                  border: '1px solid #ccc'
                },
                table: {
                  'font-size': '10px'
                }
              },
            server: {url : '/budget',
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({'type':'Income', 'year':document.getElementById("year_selected").value}),
                then :result => result.data}}).render(tableDiv_income);
            
            //Create the events to handle the edition of table contents
            let savedValue_income;

            tableDiv_income.addEventListener('focusin', ev => {
                if (ev.target.tagName === 'TD') {
                    savedValue_income = ev.target.textContent;
                    }
                });
            //Create the sending of the edited data to the server to update the db
            tableDiv_income.addEventListener('focusout', ev => {
                if (ev.target.tagName === 'TD') {
                if (savedValue_income !== ev.target.textContent) {
                    fetch('/budget/api/data_input', {
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
                
            tableDiv_income.addEventListener('keydown', ev => {
                if (ev.target.tagName === 'TD') {
                if (ev.key === 'Escape') {
                    ev.target.textContent = savedValue_income;
                    ev.target.blur();
                    }
                else if (ev.key === 'Enter') {
                    ev.preventDefault();
                    ev.target.blur();
                    }
                    }
                });
    
    tableDiv_expense = document.getElementById("Expense");    
    grid_expense = new gridjs.Grid({
            columns: [
                { id: 'id', name: 'Category', 'attributes': editableCellAttributes},
                { id: '1', name : 'Jan.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '2', name: 'Fev.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '3', name: 'Mar.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '4', name: 'Apr.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '5', name: 'May.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '6', name: 'Jun.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '7', name: 'Jul.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '8', name: 'Aug.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '9', name: 'Sep.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '10', name: 'Oct.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '11', name: 'Nov.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '12', name: 'Dec.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
            ],
            style: {
                td: {
                  border: '1px solid #ccc'
                },
                table: {
                  'font-size': '10px'
                }
              },
            server: {url : '/budget',
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({'type':'Expense', 'year':document.getElementById("year_selected").value}),
                then :result => result.data}}).render(tableDiv_expense);
            
            //Create the events to handle the edition of table contents
            let savedValue_expense;
    
            tableDiv_expense.addEventListener('focusin', ev => {
                if (ev.target.tagName === 'TD') {
                    savedValue_expense = ev.target.textContent;
                    }
                });
            //Create the sending of the edited data to the server to update the db
            tableDiv_expense.addEventListener('focusout', ev => {
                if (ev.target.tagName === 'TD') {
                if (savedValue_expense !== ev.target.textContent) {
                    fetch('/budget/api/data_input', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({'budget_type':'Expense',
                            'category_type':ev.target.dataset.elementId,
                            'year':document.getElementById("year_selected").value,
                            'column':ev.target.dataset.columnId,
                            'input':ev.target.textContent
                        }),
                        });
                    }
                savedValue_expense = undefined;
                    }
                });
                
            tableDiv_expense.addEventListener('keydown', ev => {
                if (ev.target.tagName === 'TD') {
                if (ev.key === 'Escape') {
                    ev.target.textContent = savedValue_expense;
                    ev.target.blur();
                    }
                else if (ev.key === 'Enter') {
                    ev.preventDefault();
                    ev.target.blur();
                    }
                    }
                });
    
    tableDiv_savings = document.getElementById("Savings");    
    grid_savings = new gridjs.Grid({
            columns: [
                { id: 'id', name: 'Category','attributes': editableCellAttributes},
                { id: '1', name : 'Jan.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '2', name: 'Fev.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '3', name: 'Mar.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '4', name: 'Apr.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '5', name: 'May.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '6', name: 'Jun.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '7', name: 'Jul.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '8', name: 'Aug.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '9', name: 'Sep.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '10', name: 'Oct.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '11', name: 'Nov.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
                { id: '12', name: 'Dec.', formatter: (cell)=>styling(cell),'attributes': editableCellAttributes },
            ],
            style: {
                td: {
                  border: '1px solid #ccc'
                },
                table: {
                  'font-size': '10px'
                }
              },
            server: {url : '/budget',
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({'type':'Savings', 'year':document.getElementById("year_selected").value}),
                then :result => result.data}}).render(tableDiv_savings);
            
            //Create the events to handle the edition of table contents
            let savedValue_savings;
    
            tableDiv_savings.addEventListener('focusin', ev => {
                if (ev.target.tagName === 'TD') {
                    savedValue_savings = ev.target.textContent;
                    }
                });
            //Create the sending of the edited data to the server to update the db
            tableDiv_savings.addEventListener('focusout', ev => {
                if (ev.target.tagName === 'TD') {
                if (savedValue_savings !== ev.target.textContent) {
                    fetch('/budget/api/data_input', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({'budget_type':'Savings',
                            'category_type':ev.target.dataset.elementId,
                            'year':document.getElementById("year_selected").value,
                            'column':ev.target.dataset.columnId,
                            'input':ev.target.textContent
                        }),
                        });
                    }
                savedValue_savings = undefined;
                    }
                });
                
            tableDiv_savings.addEventListener('keydown', ev => {
                if (ev.target.tagName === 'TD') {
                if (ev.key === 'Escape') {
                    ev.target.textContent = savedValue_savings;
                    ev.target.blur();
                    }
                else if (ev.key === 'Enter') {
                    ev.preventDefault();
                    ev.target.blur();
                    }
                    }
                });
}

function update_budget_tables() {
    //Function to rerender all the grids and reask the server data by fake updating the server attibute 
    grid_income.updateConfig({server: {url : '/budget',
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify({'type':'Income', 'year':document.getElementById("year_selected").value}),
    then :result => result.data}}).forceRender(tableDiv_income);
    
    grid_expense.updateConfig({server: {url : '/budget',
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify({'type':'Expense', 'year':document.getElementById("year_selected").value}),
    then :result => result.data}}).forceRender(tableDiv_expense);

    grid_savings.updateConfig({server: {url : '/budget',
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify({'type':'Savings', 'year':document.getElementById("year_selected").value}),
    then :result => result.data}}).forceRender(tableDiv_savings);
              }

//Call the initialization function on window load
window.onload = function() {
initial_setup();
}







































