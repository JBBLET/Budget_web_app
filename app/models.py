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
    year = db.Column(db.Integer)
    
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
if __name__=="__main__":
    with app.app_context():
        db.create_all()
        category_1 = Category(id=1,user_id=1,budget_type='Expense',category_type='Housing',year=2023)
        category_2 = Category(id=2,user_id=1,budget_type='Expense',category_type='Groceries',year=2023)
        category_3 = Category(id=3,user_id=1,budget_type='Income',category_type='Salaries',year=2024)
        budget_1 = Budget(user_id=1,category_id=1,year=2023,month=2,amount=110440)
        budget_2 = Budget(user_id=1,category_id=1,year=2023,month=4,amount=110640)
        budget_3 = Budget(user_id=1,category_id=2,year=2023,month=2,amount=60000)
        budget_4 = Budget(user_id=1,category_id=3,year=2024,month=2,amount=110540)
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
"""
