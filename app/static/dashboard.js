var chartIncome;
var chartExpense;
var chartSavings;
var chartbar;
var tableDiv_income;    
var grid_income;
var tableDiv_expense;    
var grid_expense;
var tableDiv_savings;    
var grid_savings;
      
function styling(string){
  if (string!=''){
      return Number(string).toLocaleString();
  }
  else{
      return '';
  }
}

function sortlabel(arrayLabel,arrayData){
  arrayOfObj = arrayLabel.map(function(d, i) {
    return {
      label: d,
      data: arrayData[i] || 0
    };
  });
  sortedArrayOfObj = arrayOfObj.sort(function(a, b) {
    return a.data-b.data;
  });

  newArrayLabel = [];
  newArrayData = [];
  sortedArrayOfObj.forEach(function(d){
    newArrayLabel.push(d.label);
    newArrayData.push(d.data);
  });

  return [newArrayLabel, newArrayData];
}

function initial_setup(){
  async function initial_fetch(){
    const response  = await fetch("/dashboard",   {method:'POST',
                          headers:{"Content-Type":"application/json"},
                          body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value})});
    console.log(response)
    const data = await response.json();
    console.log(data)
    return data;
  };
  initial_fetch().then(data => {
    var initialData =  data.data;
    var sorteddata = sortlabel(initialData.Doughnut_Income.labels, initialData.Doughnut_Income.datasets[0].data);
    const configIncomeDoughnut = {type:'doughnut',
                                  data: {labels : sorteddata[0],
                                          datasets : [{data:sorteddata[1],
                                                      label:initialData.Doughnut_Income.datasets[0].label,
                                                      backgroundColor:initialData.Doughnut_Income.datasets[0].backgroundColor
                                                    }]
                                        },
                                  options: {responsive: false,
                                            plugins:{

                                              legend:{
                                                position:'right',
                                                align:"center",
                                                title :{
                                                  text:'Income'
                                                },
                                                labels:{
                                                  boxWidth:15,
                                                  font:{
                                                    size:8
                                                  }
                                                }
                                              }
                                            }
                                          }
                                };                             
    chartIncome = new Chart(document.getElementById('IncomeDoughnut').getContext("2d"), configIncomeDoughnut);
    console.log(initialData)
    var sorteddata = sortlabel(initialData.Doughnut_Expense.labels, initialData.Doughnut_Expense.datasets[0].data);
    console.log(sorteddata)
    const configExpenseDoughnut = {type:'doughnut',
                                  data: {labels : sorteddata[0],
                                    datasets : [{data:sorteddata[1],
                                                label:initialData.Doughnut_Expense.datasets[0].label,
                                                backgroundColor:initialData.Doughnut_Expense.datasets[0].backgroundColor
                                              }]
                                  },
                                  options: {responsive: false,
                                    plugins:{
                                      legend:{
                                        position:'right',
                                        align:"center",
                                        title :{
                                          text:'Expense'
                                        },
                                        labels:{
                                          boxWidth:15,
                                          font:{
                                            size:8
                                          }
                                        }
                                      }
                                    }
                                  }
                                };                     
    chartExpense = new Chart(document.getElementById('ExpenseDoughnut').getContext("2d"), configExpenseDoughnut);

    var sorteddata = sortlabel(initialData.Doughnut_Savings.labels, initialData.Doughnut_Savings.datasets[0].data);
    const configSavingsDoughnut = {type:'doughnut',
                                  data: {labels : sorteddata[0],
                                    datasets : [{data:sorteddata[1],
                                                label:initialData.Doughnut_Savings.datasets[0].label,
                                                backgroundColor:initialData.Doughnut_Savings.datasets[0].backgroundColor
                                              }]
                                  },
                                  options: {responsive: false,
                                    plugins:{
                                      legend:{
                                        position:'right',
                                        title :{
                                          text:'Savings'
                                        },
                                        align:"center",
                                        labels:{
                                          boxWidth:15,
                                          font:{
                                            size:8
                                          }
                                        }
                                      }
                                    }
                                  }
                                };                           
    chartSavings = new Chart(document.getElementById('SavingsDoughnut').getContext("2d"), configSavingsDoughnut);

    const configBarChart = {type: 'bar',
                            data: {labels : initialData.BarChart.labels,
                                  datasets : initialData.BarChart.data},
                            options: {responsive: false,
                              plugins:{
                                legend:{
                                  display: false
                                }
                              }}
                          };
    chartBar = new Chart(document.getElementById('BarChart').getContext("2d"), configBarChart);
  
    tableDiv_income = document.getElementById("Income");    
    grid_income = new gridjs.Grid({
            columns: [
                { id: 'Category', name : 'Category'},
                { id: 'Tracked', name: 'Tracked', formatter: (cell)=>styling(cell)},
                { id: 'Budget', name: 'Budget', formatter: (cell)=>styling(cell)},
                { id: 'Completed', name: 'Completed'},
                { id: 'Excess', name: 'Excess', formatter: (cell)=>styling(cell)},
                { id: 'Remaining', name: 'Remaining', formatter: (cell)=>styling(cell)},
            ],
            className: {
              td: 'td_grid',
              table: 'table_grid'},
            server: {url : '/dashboard',
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
                then :result => result.data.Table.Income}}).render(tableDiv_income);

    tableDiv_expense = document.getElementById("Expense");    
    grid_expense = new gridjs.Grid({
            columns: [
                { id: 'Category', name : 'Category'},
                { id: 'Tracked', name: 'Tracked', formatter: (cell)=>styling(cell)},
                { id: 'Budget', name: 'Budget', formatter: (cell)=>styling(cell)},
                { id: 'Completed', name: 'Completed'},
                { id: 'Excess', name: 'Excess', formatter: (cell)=>styling(cell)},
                { id: 'Remaining', name: 'Remaining', formatter: (cell)=>styling(cell)},
            ],
            className: {
              td: 'td_grid',
              table: 'table_grid'},
            server: {url : '/dashboard',
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
                then :result => result.data.Table.Expense}}).render(tableDiv_expense);

    tableDiv_savings = document.getElementById("Savings");    
    grid_savings = new gridjs.Grid({
            columns: [
                { id: 'Category', name : 'Category'},
                { id: 'Tracked', name: 'Tracked', formatter: (cell)=>styling(cell)},
                { id: 'Budget', name: 'Budget', formatter: (cell)=>styling(cell)},
                { id: 'Completed', name: 'Completed'},
                { id: 'Excess', name: 'Excess', formatter: (cell)=>styling(cell)},
                { id: 'Remaining', name: 'Remaining', formatter: (cell)=>styling(cell)},
            ],
            className: {
              td: 'td_grid',
              table: 'table_grid'},
            server: {url : '/dashboard',
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
                then :result => result.data.Table.Savings}}).render(tableDiv_savings);
  });
  };

function update_chart(){
  async function fetch_data(){
    const response  = await fetch("/dashboard",   {method:'POST',
                          headers:{"Content-Type":"application/json"},
                          body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value})});
    console.log(response)
    const data = await response.json();
    return data;
  };
  fetch_data().then(data => {
    var dataupdate = data.data;

    chartIncome.data.labels = dataupdate.Doughnut_Income.labels;
    chartIncome.data.datasets = dataupdate.Doughnut_Income.datasets;
    chartIncome.update();

    chartExpense.data.labels = dataupdate.Doughnut_Expense.labels;
    chartExpense.data.datasets = dataupdate.Doughnut_Expense.datasets;
    chartExpense.update();

    chartSavings.data.labels = dataupdate.Doughnut_Savings.labels;
    chartSavings.data.datasets = dataupdate.Doughnut_Savings.datasets;
    chartSavings.update();

    chartBar.data.labels = dataupdate.BarChart.labels;
    chartBar.data.datasets = dataupdate.BarChart.data;
    chartBar.update();
  });
  //change the config to fecth the data again force render the grid
  grid_income.updateConfig({server: {url : "/dashboard",
  method:'POST',
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
  then :result => result.data.Table.Income}}).forceRender(tableDiv_income);

  grid_expense.updateConfig({server: {url : "/dashboard",
  method:'POST',
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
  then :result => result.data.Table.Expense}}).forceRender(tableDiv_expense);

  grid_savings.updateConfig({server: {url : "/dashboard",
  method:'POST',
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value}),
  then :result => result.data.Table.Savings}}).forceRender(tableDiv_savings);
};

window.onload = function() {
    initial_setup();
}