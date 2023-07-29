from flask_login import UserMixin
"""
if __name__=="__main__":
    import os
    from flask import Flask
    from flask_sqlalchemy import SQLAlchemy
    basedir = os.path.abspath(os.path.dirname(__file__))

    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] =\
        'sqlite:///' + os.path.join(basedir, 'budgeting.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db = SQLAlchemy(app)
else:
"""
from . import db

class User(UserMixin,db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(100), nullable=False)
    surname = db.Column(db.String(100), nullable=False)
    login_id = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)

    budget = db.relationship('Budget', backref="user")
    transaction = db.relationship('Transaction', backref="user")
    category = db.relationship('Category', backref = "user")


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="Cascade"), nullable=False)
    budget_type = db.Column(db.String(100), nullable=False)
    category_type = db.Column(db.String(100), nullable=False)

    budget = db.relationship('Budget', backref="category")
    transaction = db.relationship('Transaction', backref="category")



class Budget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="Cascade"), nullable=False)
    category_id = db.Column(db.Integer,db.ForeignKey("category.id", ondelete="Cascade"),nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Integer, nullable=False)

    
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="Cascade"), nullable=False)
    category_id =db.Column(db.Integer,db.ForeignKey("category.id",ondelete="Cascade"),nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    day = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Integer, nullable=False)

"""
def create_budget_table(category_list,budget_element_list):
    from the List output of the querry, this function will create the data
    to insert into the grid in the budget creation 
    List of db.model object -> [] containing the rows, category and set budget per month
    
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


if __name__=="__main__":
    with app.app_context():
        db.create_all()
        category_1 = Category(id=1,user_id=1,budget_type='Expense',category_type='Housing')
        category_2 = Category(id=2,user_id=1,budget_type='Expense',category_type='Groceries')
        category_3 = Category(id=3,user_id=1,budget_type='Income',category_type='Salaries')
        budget_1 = Budget(user_id=1,category_id=1,year=2023,month=2,amount=110440)
        budget_2 = Budget(user_id=1,category_id=1,year=2023,month=4,amount=110640)
        budget_3 = Budget(user_id=1,category_id=2,year=2023,month=2,amount=60000)
        budget_4 = Budget(user_id=1,category_id=1,year=2024,month=2,amount=110540)
        db.session.add(budget_1)
        db.session.add(budget_2)
        db.session.add(budget_3)
        db.session.add(budget_4)
        db.session.add(category_1)
        db.session.add(category_2)
        db.session.add(category_3)
        transaction = Transaction(user_id=1,category_id=1,year=2023,month=2,day=27,amount=110440) 
        db.session.add(transaction)
        db.session.commit()
with app.app_context():
    category_list = Category.query.filter_by(user_id=1,budget_type='Expense').all()
    budget_element_list = Budget.query.join(Category, Budget.category_id==Category.id).filter(Budget.user_id==1,Budget.year==2023,Category.budget_type=='Expense').all()

    data = create_budget_table(category_list,budget_element_list)
    print(data)
    """
