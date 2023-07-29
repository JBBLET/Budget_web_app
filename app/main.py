# main.py

from flask import Blueprint, render_template, request,abort
from flask_login import login_required, current_user
from .models import User, Budget, Transaction, Category
from .analysis import create_budget_table
from . import db

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.firstname)

@main.route('/api/data/budget', methods=['POST'])
@login_required
def update_data():
    data = request.json
    year, budget_type = data.get('year'), data.get('type')

    category_list = Category.query.filter_by(user_id=current_user.id,budget_type=budget_type).all()
    budget_element_list = Budget.query.join(Category, Budget.category_id==Category.id).filter(Budget.user_id==current_user.id,Budget.year==year,Category.budget_type==budget_type).all()
    
    data = create_budget_table(category_list,budget_element_list)
    # response
    return {
        'data': data
    }

@main.route('/api/data/budget_input', methods=['POST'])
@login_required
def update():
    data = request.get_json()
    category_id_list = Category.query.filter(Category.user_id==current_user.id,Category.budget_type==data['budget_type'],Category.category_type==data['category_type']).all()
    if data['column']=='id':
        if category_id_list==[]:
            category = Category(user_id=current_user.id,budget_type=data['budget_type'],category_type=data['input'])
            db.session.add(category)
        else:
            Category_selected = category_id_list[0]
            setattr(Category_selected, 'category_type', data['input'])
    else:
        budget_element_list = Budget.query.filter(Budget.user_id==current_user.id,Budget.category_id==category_id_list[0].id,Budget.year==int(data['year']), Budget.month==int(data['column'])).all()
        if budget_element_list==[]:
            budget = Budget(user_id=current_user.id,category_id=category_id_list[0].id,year=int(data['year']),month=int(data['column']),amount=int(data['input']))
            db.session.add(budget)
        else:
            user = budget_element_list[0]
            setattr(user, 'amount', int(data['input']))
    db.session.commit()
    return '', 204
