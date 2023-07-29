def create_budget_table(category_list,budget_element_list):
    """from the List output of the querry, this function will create the data
    to insert into the grid in the budget creation 
    List of db.model object -> [] containing the rows, category and set budget per month
    """
    out = {}
    for category in category_list:
        out[category.id] = {"id":category.category_type,
                            "1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0}
    for elem in budget_element_list:
        out[elem.category_id][str(elem.month)] = elem.amount
    return list(out.values())
