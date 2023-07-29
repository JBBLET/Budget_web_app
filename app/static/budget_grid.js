
const editableCellAttributes = (data, row, col) => {
    if (row) {
        return {contentEditable: 'true', 'data-element-id': row.cells[0].data};
        }
    else {
        return {};
        }
    };

const tableDiv_income = document.getElementById("Income");    
var grid_income = new gridjs.Grid({
        columns: [
            { id: 'id', name: 'Category','attributes': editableCellAttributes},
            { id: '1', name : 'Janv','attributes': editableCellAttributes },
            { id: '2',name: 'Fev','attributes': editableCellAttributes },
            { id: '3',name: 'March','attributes': editableCellAttributes },
            { id: '4',name: 'April','attributes': editableCellAttributes },
            { id: '5',name: 'May','attributes': editableCellAttributes },
            { id: '6',name: 'June','attributes': editableCellAttributes },
            { id: '7',name: 'July','attributes': editableCellAttributes },
            { id: '8',name: 'Aug','attributes': editableCellAttributes },
            { id: '9',name: 'Sept','attributes': editableCellAttributes },
            { id: '10',name: 'Oct','attributes': editableCellAttributes },
            { id: '11',name: 'Nov','attributes': editableCellAttributes },
            { id: '12',name: 'Dec','attributes': editableCellAttributes },
        ],
        server: {url : '/api/data/budget',
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({'type':'Income', 'year':document.getElementById("year_selected").value}),
            then :result => result.data}}).render(tableDiv_income);

        let savedValue_income;

        tableDiv_income.addEventListener('focusin', ev => {
            if (ev.target.tagName === 'TD') {
                savedValue_income = ev.target.textContent;
                }
            });
    
        tableDiv_income.addEventListener('focusout', ev => {
            if (ev.target.tagName === 'TD') {
            if (savedValue_income !== ev.target.textContent) {
                fetch('/api/data/budget_input', {
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

const tableDiv_expense = document.getElementById("Expense");    
var grid_expense = new gridjs.Grid({
        columns: [
            { id: 'id', name: 'Category','attributes': editableCellAttributes},
            { id: '1', name : 'Janv','attributes': editableCellAttributes },
            { id: '2',name: 'Fev','attributes': editableCellAttributes },
            { id: '3',name: 'March','attributes': editableCellAttributes },
            { id: '4',name: 'April','attributes': editableCellAttributes },
            { id: '5',name: 'May','attributes': editableCellAttributes },
            { id: '6',name: 'June','attributes': editableCellAttributes },
            { id: '7',name: 'July','attributes': editableCellAttributes },
            { id: '8',name: 'Aug','attributes': editableCellAttributes },
            { id: '9',name: 'Sept','attributes': editableCellAttributes },
            { id: '10',name: 'Oct','attributes': editableCellAttributes },
            { id: '11',name: 'Nov','attributes': editableCellAttributes },
            { id: '12',name: 'Dec','attributes': editableCellAttributes },
        ],
        server: {url : '/api/data/budget',
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({'type':'Expense', 'year':document.getElementById("year_selected").value}),
            then :result => result.data}}).render(tableDiv_expense);

        let savedValue_expense;

        tableDiv_expense.addEventListener('focusin', ev => {
            if (ev.target.tagName === 'TD') {
                savedValue_expense = ev.target.textContent;
                }
            });
    
        tableDiv_expense.addEventListener('focusout', ev => {
            if (ev.target.tagName === 'TD') {
            if (savedValue_expense !== ev.target.textContent) {
                fetch('/api/data/budget_input', {
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

const tableDiv_savings = document.getElementById("Savings");    
var grid_savings = new gridjs.Grid({
        columns: [
            { id: 'id', name: 'Category','attributes': editableCellAttributes},
            { id: '1', name : 'Janv','attributes': editableCellAttributes },
            { id: '2',name: 'Fev','attributes': editableCellAttributes },
            { id: '3',name: 'March','attributes': editableCellAttributes },
            { id: '4',name: 'April','attributes': editableCellAttributes },
            { id: '5',name: 'May','attributes': editableCellAttributes },
            { id: '6',name: 'June','attributes': editableCellAttributes },
            { id: '7',name: 'July','attributes': editableCellAttributes },
            { id: '8',name: 'Aug','attributes': editableCellAttributes },
            { id: '9',name: 'Sept','attributes': editableCellAttributes },
            { id: '10',name: 'Oct','attributes': editableCellAttributes },
            { id: '11',name: 'Nov','attributes': editableCellAttributes },
            { id: '12',name: 'Dec','attributes': editableCellAttributes },
        ],
        server: {url : '/api/data/budget',
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({'type':'Savings', 'year':document.getElementById("year_selected").value}),
            then :result => result.data}}).render(tableDiv_savings);

        let savedValue_savings;

        tableDiv_savings.addEventListener('focusin', ev => {
            if (ev.target.tagName === 'TD') {
                savedValue_savings = ev.target.textContent;
                }
            });
    
        tableDiv_savings.addEventListener('focusout', ev => {
            if (ev.target.tagName === 'TD') {
            if (savedValue_savings !== ev.target.textContent) {
                fetch('/api/data/budget_input', {
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

function update_tables() {
    grid_income.updateConfig({server: {url : '/api/data/budget',
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify({'type':'Income', 'year':document.getElementById("year_selected").value}),
    then :result => result.data}}).forceRender(tableDiv_income);
    
    grid_expense.updateConfig({server: {url : '/api/data/budget',
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify({'type':'Expense', 'year':document.getElementById("year_selected").value}),
    then :result => result.data}}).forceRender(tableDiv_expense);

    grid_savings.updateConfig({server: {url : '/api/data/budget',
    method:'POST',
    headers: {'Content-Type': 'application/json'},
    body:JSON.stringify({'type':'Savings', 'year':document.getElementById("year_selected").value}),
    then :result => result.data}}).forceRender(tableDiv_savings);
              }









































