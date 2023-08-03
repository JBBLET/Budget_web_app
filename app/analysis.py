from datetime import date

def create_budget_table(category_list,budget_element_list):
    """from the List output of the querry, this function will create the data
    to insert into the grid in the budget creation 
    List of db.model object -> [] containing the rows, category and set budget per month
    """
    out = {}
    for category in category_list:
        out[category.id] = {"id":category.category_type,
                            "1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":"","10":"","11":"","12":""}
    for elem in budget_element_list:
        out[elem.category_id][str(elem.month)] = str(elem.amount)
    out[""] = {'id':"","1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":"","10":"","11":"","12":""}
    return list(out.values())


def create_transaction_table(transaction_list):
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