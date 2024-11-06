from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    username = db.Column(db.String(256), unique=True, nullable=False)
    displayName = db.Column(db.String(256), nullable=False)
    loginEmail = db.Column(db.String(256), unique=True, nullable=False)

    def __init__(self, username, displayName, loginEmail, ):
        self.username = username
        self.loginEmail = loginEmail