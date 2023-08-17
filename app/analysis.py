from datetime import date
import pandas as pd

colors = {'Income':([0,128,0],[144, 238, 144],[72,183,72]),'Expense':([192,64,0],[255,213,128],[223,138,64]),'Savings':([0,0,139],[167, 199, 231],[84,100,185])}
month_name = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'}
budget_type = ['Income','Expense','Savings']

def linear_gradient(start, end, n=10):
    RGB_list = ["rgb({},{},{})".format(start[0],start[1],start[2])]
    for t in range(1, n):
        curr_vector = [int(start[j] + (float(t)/(n-1))*(end[j]-start[j])) for j in range(3)]
        RGB_list.append("rgb({},{},{})".format(curr_vector[0],curr_vector[1],curr_vector[2]))
    return RGB_list


def create_budget_table(category_list,budget_element_list):
    """from the List output of the querry, this function will create the data
    to insert into the grid in the budget creation 
    List of db.model object -> [] containing the rows, category and set budget per month
    """
    out = {}
    for category in category_list:
        out[category.id] = {"id":category.category_type,
                            "1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":"","10":"","11":"","12":""}
    out['-1'] = {'id':"","1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":"","10":"","11":"","12":""}

    for elem in budget_element_list:
        out[elem.category_id][str(elem.month)] = elem.amount
    return list(out.values())


def create_transaction_table(transaction_list):
    """from the List output of the querry, this function will create the data
    to insert into the grid in the transaction creation 
    List of db.model object -> [] containing the rows of the transaction
    """
    out=[]
    for transaction in transaction_list:
        transaction_date = date(transaction[0].year,transaction[0].month,transaction[0].day)
        date_string = transaction_date.strftime("%Y-%m-%d")
        transaction_dict = {'id':transaction[0].id,
                            'date':date_string,
                            'type':transaction[1].budget_type,
                            'category':transaction[1].category_type,
                            'amount':transaction[0].amount}
        out.append(transaction_dict)
    return out

def make_data_frame(cat_list,budget_list,transaction_list):
    """from the List output of the querry, this function will create the data
    frame used to analyze the data in the dashboard
    List of db.model object -> [] containing the rows of the transaction
    """
    df = pd.DataFrame(0,index=[cat.category_type for cat in cat_list],columns=['Tracked','Budget'])
    for budget_entry in budget_list:
            df.loc[budget_entry[1].category_type,'Budget']+=budget_entry[0].amount
    for transaction_entry in transaction_list:
            df.loc[transaction_entry[1].category_type,'Tracked']+=transaction_entry[0].amount
    df.sort_values(by=['Tracked','Budget'])
    return(df)

def make_year_df(categories,month_df):
    """from the List output of the querry, this function will create the data
    frame used to analyze the data in the dashboard for the total year
    List of db.model object -> [] containing the rows of the transaction
    """
    year_df = {key:pd.DataFrame(0,index=[cat.category_type for cat in item],columns=['Tracked','Budget']) for key, item in categories.items()}
    for i in range(2,13):
        for budget in budget_type:
            year_df[budget]+=month_df[i][budget]
    return(year_df)


def complete_df(df_dict):
    """from the dataframe of {Income, Expense, Savings} we want to complete it in place
    and create the completed, remaining and excess columns
    """
    for budget in budget_type:
        Completed,Excess,Remaining= [],[],[]
        for index, row in df_dict[budget].iterrows():
            if row['Budget'] != 0:
                percentage = (row['Tracked']/row['Budget'])*100
                Completed.append("{:.2f}".format(percentage)+' %')
            else:
                Completed.append('')
            if row['Tracked'] >= row['Budget']:
                Remaining.append(0)
                Excess.append(row['Tracked']-row['Budget'])
            else:
                Remaining.append(row['Budget']-row['Tracked'])
                Excess.append(0)
        df_dict[budget]['Completed'] = Completed
        df_dict[budget]['Excess'] = Excess
        df_dict[budget]['Remaining'] = Remaining

def make_table(dict_df):
    """from all the dataframe we want to create the data that will be put in the dashboard 
    grids to summarize the data this includes the total part
    """
    out = {}
    for budget in budget_type:
        df = dict_df[budget]
        total  = [df['Tracked'].sum(),df['Budget'].sum()]
        if total[1]!=0:
            total.append("{:.2f}".format(total[0]/total[1])+' %')
        else:
            total.append('0.00%')
        if total[0] >= total[1]:
            total.append(total[0]-total[1])
            total.append(0)
        else:
            total.append(0)
            total.append(total[1]-total[0])
        df.loc['Total'] = total
        df = df.reset_index(inplace=False)
        df = df.rename(columns = {'index':'Category'})
        out[budget] = list(df.to_dict('index').values())
    return(out)

def make_doughnut(dict_df,budget_type,label):
    """take the dicts of data frame and labels to make the data in a shape
    that can be imported in the doughnut chart in chart.js 
    """
    data = {'datasets':[]}
    df = dict_df[budget_type]
    df = df[df.Tracked != 0]
    data['labels'] = list(df.index)
    if len(data['labels'])<4:
        data['datasets'].append({'data':[el for el in list(df['Tracked'])],
                                'label':label,
                                'backgroundColor':linear_gradient(colors[budget_type][1],colors[budget_type][0],len(data['labels']))})
    else:
        data['labels'] = list(df.index)[:4]+['Other']
        data['datasets'].append({'data':[el for el in list(df['Tracked'])[:4]]+[sum(list(df['Tracked'])[4:])],
                                'label':label,
                                'backgroundColor':linear_gradient(colors[budget_type][1],colors[budget_type][0],len(data['labels']))})
    return data

def make_year_barcharts(year_data):
    """take the dicts of data frame and labels to make the data in a shape
    that can be imported in the barchart chart in chart.js
    """
    data= {'labels':['Jan','Fev','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 'data':[]}
    for i in range(len(budget_type)):
        dataset = {}
        dataset['label'] = budget_type[i]
        dataset['data'] = [str(min(year_data[month][budget_type[i]]['Tracked'].sum(),year_data[month][budget_type[i]]['Budget'].sum())) for month in range(1,13)]
        color = colors[budget_type[i]][2]
        dataset['backgroundColor'] = "rgb({},{},{})".format(color[0],color[1],color[2])
        dataset['stack']= 'Stack '+str(i)
        data['data'].append(dataset)

        dataset = {'label':budget_type[i]+' Excess'}
        dataset['data'] = [str(max(0,year_data[month][budget_type[i]]['Tracked'].sum()-year_data[month][budget_type[i]]['Budget'].sum())) for month in range(1,13)]
        color = colors[budget_type[i]][0]
        dataset['backgroundColor'] = "rgb({},{},{})".format(color[0],color[1],color[2])
        dataset['stack']= 'Stack '+str(i)
        data['data'].append(dataset)

        dataset = {'label':budget_type[i]+' Remaining'}
        dataset['data'] = [str(max(0,year_data[month][budget_type[i]]['Budget'].sum()-year_data[month][budget_type[i]]['Tracked'].sum())) for month in range(1,13)]
        color = colors[budget_type[i]][1]
        dataset['backgroundColor'] = "rgb({},{},{})".format(color[0],color[1],color[2])
        dataset['stack']= 'Stack '+str(i)
        data['data'].append(dataset)
    return data

def make_dashboard_data(categories,year_data,months):
    """Take the categories list and all the transaction for the year obtained trough querrying
    the db to create all the data for the dashboard in the form of a dict that will be sent to the 
    client
    """
    output = {}
    months_df = {}
    for key ,item in year_data.items():
        temp = {}
        for budget in budget_type:
            df = make_data_frame(categories[budget],item[budget][0],item[budget][1])
            temp[budget] = df
        months_df[key] = temp
    if len(months)!=1:
        year_df = make_year_df(categories,months_df)
        complete_df(year_df)
        output['Doughnut_Income'] = make_doughnut(year_df, 'Income', 'Year')
        output['Doughnut_Expense'] = make_doughnut(year_df, 'Expense', 'Year')
        output['Doughnut_Savings'] = make_doughnut(year_df, 'Savings', 'Year')
        output['Table']=make_table(year_df)
    else:
        output['Doughnut_Income'] = make_doughnut(months_df[months[0]], 'Income', month_name[months[0]])
        output['Doughnut_Expense'] = make_doughnut(months_df[months[0]], 'Expense', month_name[months[0]])
        output['Doughnut_Savings'] = make_doughnut(months_df[months[0]], 'Savings', month_name[months[0]])
        
    for key ,item in months_df.items():
        complete_df(item)
    output['BarChart'] = make_year_barcharts(months_df)
    if len(months)==1:
        output['Table'] = make_table(months_df[months[0]])
    return(output)