# main.py
from flask import Blueprint, render_template, request,abort
from flask_login import login_required, current_user
from .models import User, Budget, Transaction, Category
from .analysis import make_dashboard_data, create_budget_table, create_transaction_table, make_data_frame
from . import db
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/budget')
@login_required
def budget():
    return render_template('budget.html')

@main.route('/budget/api/data', methods=['POST'])
@login_required
def get_data_budget():
    data = request.get_json()
    year_selected, budget_type_selected = data.get('year'), data.get('type')

    category_list = Category.query.filter_by(user_id=current_user.id,budget_type=budget_type_selected).all()
    budget_element_list = Budget.query.join(Category, Budget.category_id==Category.id).filter(Budget.user_id==current_user.id,Budget.year==year_selected,Category.budget_type==budget_type_selected).all()
    
    data = create_budget_table(category_list,budget_element_list)
    # response
    return {
        'data': data
    }

@main.route('/budget/api/data_input', methods=['POST'])
@login_required
def update_budget_input():
    data = request.get_json()
    category_id_list = Category.query.filter(Category.user_id==current_user.id,Category.budget_type==data['budget_type'],Category.category_type==data['category_type']).all()
    if data['column']=='id':
        if category_id_list==[]:
            category = Category(user_id=current_user.id,budget_type=data['budget_type'],category_type=data['input'])
            db.session.add(category)
        elif data['input']=='':
            db.session.query(Category).filter(Category.user_id==current_user.id,Category.id==category_id_list[0].id).delete()
        else:
            Category_selected = category_id_list[0]
            setattr(Category_selected, 'category_type', data['input'])
    else:
        budget_element_list = Budget.query.filter(Budget.user_id==current_user.id,Budget.category_id==category_id_list[0].id,Budget.year==int(data['year']), Budget.month==int(data['column'])).all()
        if budget_element_list==[]:
            budget = Budget(user_id=current_user.id,category_id=category_id_list[0].id,year=int(data['year']),month=int(data['column']),amount=int(data['input']))
            db.session.add(budget)
        elif data['input']=='':
            db.session.query(Budget).filter(Budget.user_id==current_user.id,Budget.category_id==category_id_list[0].id,year=int(data['year']),month=int(data['column'])).delete()
        else:
            user = budget_element_list[0]
            setattr(user, 'amount', int(data['input']))
    db.session.commit()
    return '', 204


###Transaction handling
@main.route('/transaction',methods=['GET', 'POST'])
@login_required
def transaction():
    return render_template('transaction.html')

@main.route('/transaction/input',methods=['POST'])
@login_required
def transaction_input():
    if request.method=='POST':
            result = request.form
            date = result.get('date')
            budget_type = result.get('budget_type')
            category_type = result.get('category_type')
            amount = result.get('amount')
            if not(date=='' or budget_type=='Type' or category_type=='Category' or amount=='0'): 
                date = datetime.strptime(date,'%Y-%m-%d')
                category_id = Category.query.filter(Category.user_id==current_user.id,Category.budget_type==budget_type,Category.category_type==category_type).all()[0].id
                transaction=Transaction(user_id=current_user.id,category_id=category_id,year=int(date.year),month=int(date.month),day=int(date.day),amount=int(amount))
                db.session.add(transaction)
                db.session.commit()
    return '', 204


@main.route('/transaction/api/category', methods=['POST'])
@login_required
def get_category_list():
    data = request.get_json()
    type_selected = data.get('type')
    if type_selected=='Type':
        return []
    else:
        category_list = Category.query.filter(Category.user_id==current_user.id,Category.budget_type==type_selected).all()
        data = [category.category_type for category in category_list]
    # response
    return {
        'data': data
    }

@main.route('/transaction/api/data', methods=['POST'])
@login_required
def get_data_transaction():
    data = request.get_json()
    year_selected,month_selected = data.get('year'), data.get('month')
    if month_selected=='Current Month':
        month_selected = [datetime.today().month]
    elif month_selected =='Total Year':
        month_selected=[i for i in range(1,13)]
    else:
        month_selected = [month_selected]
    if year_selected =='Current Year':
        year_selected = datetime.today().year
    transaction_list = db.session.query(Transaction,Category).join(Category).filter(Category.user_id==current_user.id,Transaction.user_id==current_user.id,Category.id==Transaction.category_id,Transaction.year==year_selected,Transaction.month.in_(month_selected)).order_by(Transaction.day.desc()).all()
    data = create_transaction_table(transaction_list)
    # response
    return {
        'data': data 
    }

@main.route('/transaction/api/data_delete', methods=['POST'])
@login_required
def delete_transaction():
    data = request.get_json()
    print(data['transaction_id'])
    db.session.query(Transaction).filter(Transaction.user_id==current_user.id,Transaction.id==int(data['transaction_id'])).delete()
    db.session.commit()
    return '', 204


###Dashboard Handling
@main.route('/dashboard',methods=['GET','POST'])
@login_required
def dashboard():
    if request.method == 'POST':
        data = request.get_json()
        year_selected,month_selected = data.get('year'), data.get('month')
        if month_selected=='Current Month':
            month_selected = [datetime.today().month]
        elif month_selected =='Total Year':
            month_selected=[i for i in range(1,13)]
        else:
            month_selected = [int(month_selected)]
        if year_selected =='Current Year':
            year_selected = datetime.today().year
        
        categories = {}
        for budget_type in ['Income','Expense','Savings']:
            category_list = Category.query.filter_by(user_id=current_user.id,budget_type=budget_type).all()
            categories[budget_type] = category_list
        output = {}
        for month in range(1,13):
            temp = {}
            for budget_type in ['Income','Expense','Savings']:
                budget_list = db.session.query(Budget,Category).join(Category).filter(Budget.user_id==current_user.id,Budget.user_id==current_user.id,Category.id==Budget.category_id,Category.budget_type==budget_type,Budget.year==year_selected,Budget.month==month).all()
                transaction_list = db.session.query(Transaction,Category).join(Category).filter(Category.user_id==current_user.id,Transaction.user_id==current_user.id,Category.id==Transaction.category_id,Category.budget_type==budget_type,Transaction.year==year_selected,Transaction.month==month).all()
                temp[budget_type]=[budget_list,transaction_list]
            output[month]=temp
        data = make_dashboard_data(categories,output,month_selected)
        # response
        return {'data': data }
    else:
        return render_template('dashboard.html')