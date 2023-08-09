var chartIncome;
var chartExpense;
var chartSavings;
var chartbar;

function initialSetup(){
  async function initialFetch(){
    const response  = await fetch("/dashboard",   {method:'POST',
                          headers:{"Content-Type":"application/json"},
                          body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value})});
    console.log(response)
    const data = await response.json();
    return data;
  };
  initialFetch().then(data => {
    var initialData =  data.data;
    const configIncomeDoughnut = {type:'doughnut',
                                  data: {labels : initialData.Doughnut_Income.labels,
                                          datasets : initialData.Doughnut_Income.datasets},
                                          options: {responsive: false}
                                };                             
    chartIncome = new Chart(document.getElementById('IncomeDoughnut').getContext("2d"), configIncomeDoughnut);

    const configExpenseDoughnut = {type:'doughnut',
                                  data: {labels : initialData.Doughnut_Expense.labels,
                                          datasets : initialData.Doughnut_Expense.datasets},
                                  options: {responsive: false}
                                };                     
    chartExpense = new Chart(document.getElementById('ExpenseDoughnut').getContext("2d"), configExpenseDoughnut);

    const configSavingsDoughnut = {type:'doughnut',
                                  data: {labels : initialData.Doughnut_Savings.labels,
                                          datasets : initialData.Doughnut_Savings.datasets},
                                  options: {responsive: false}
                                };                           
    chartSavings = new Chart(document.getElementById('SavingsDoughnut').getContext("2d"), configSavingsDoughnut);

    const configBarChart = {type: 'bar',
                            data: {labels : initialData.BarChart.labels,
                                  datasets : initialData.BarChart.data},
                            options: {responsive: false}
                          };
    chartBar = new Chart(document.getElementById('BarChart').getContext("2d"), configBarChart);
            
  });
  };

function updateChart(){
  async function fetchData(){
    const response  = await fetch("/dashboard",   {method:'POST',
                          headers:{"Content-Type":"application/json"},
                          body:JSON.stringify({'year':document.getElementById("year_selected").value,'month':document.getElementById("month_selected").value})});
    console.log(response)
    const data = await response.json();
    return data;
  };
  fetchData().then(data => {
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
};

window.onload = function() {
    initialSetup();
}