import datetime
from . import db
from werkzeug.security import generate_password_hash
        
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    location = db.Column(db.String(255), nullable=False)
    biography = db.Column(db.String(255), nullable=False)
    profile_photo = db.Column(db.String(255), nullable=False)
    joined_on = db.Column(db.Date, nullable=False, default=datetime.datetime.now())
    
    posts = db.relationship('Post', backref='User', passive_deletes=True, lazy=True)
    likes = db.relationship('Like', backref='User', passive_deletes=True, lazy=True)
    followers = db.relationship('Follow', backref='User', passive_deletes=True, lazy=True)
    
    def __init__(self, username, password, firstname, lastname, email, 
                location, biography, profile_photo):
                    
                self.username = username
                self.password = generate_password_hash(password, method='pbkdf2:sha256')
                self.firstname = firstname
                self.lastname = lastname
                self.email = email
                self.location = location
                self.biography = biography
                self.profile_photo = profile_photo


class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    photo = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.String(255), nullable=False)
    created_on = db.Column(db.Date, default=datetime.datetime.now(), nullable=False)
    
    likes = db.relationship('Like', backref='Post', passive_deletes=True, lazy=True)
    
    def __init__(self, user_id, photo, caption):
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        

class Like(db.Model):
    __tablename__ = 'likes'
    __table_args__ = (db.UniqueConstraint('user_id', 'post_id', name='_user_post_uc'), )
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    
    def __init__(self, user_id, post_id):
        self.user_id = user_id
        self.post_id = post_id
        

class Follow(db.Model):
    __tablename__ = 'follows'
    __table_args__ = (db.UniqueConstraint('user_id', 'follower_id', name='_user_follower_uc'), )
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    follower_id = db.Column(db.Integer, nullable=False)
    
    def __init__(self, user_id, follower_id):
        self.user_id = user_id
        self.follower_id = follower_id
    