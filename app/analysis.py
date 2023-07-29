



def create_budget_table(category_list,budget_element_list):
    """from the List output of the querry, this function will create the data
    to insert into the grid in the budget creation 
    List of db.model object -> [] containing the rows, category and set budget per month
    """
    month = {1:"january",2:"february",3:"march",4:"april",5:"may",6:"june",7:"july",8:"august",9:"september",10:"october",11:"november",12:"december"}
    out = {}
    for category in category_list:
        out[category.id] = {'ids':[-1]*12,
                            "category_type":category.category_type,
                            "january":0,"february":0,"march":0,"april":0,"may":0,"june":0,"july":0,"august":0,"september":0,"october":0,"november":0,"december":0}
    for elem in budget_element_list:
        out[elem.category_id][month[elem.month]] = elem.amount
        out[elem.category_id]['ids'][elem.month-1] = elem.id
    return list(out.values())
        

def modification_budget_table():
    """From the dict of the Json, I want to identify the correct entry that was modified,
    and update it in the database
    Json Dict -> [{Budget_id, amount}]
    """