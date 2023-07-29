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
    print(data)
    if 'id' not in data:
        abort(400)
    user = User.query.get(data['id'])
    for field in ['name', 'age', 'address', 'phone', 'email']:
        if field in data:
            setattr(user, field, data[field])
    db.session.commit()
    return '', 204
