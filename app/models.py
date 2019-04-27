import datetime
from . import db

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    photo = db.Column(db.String(255))
    caption = db.Column(db.String(255))
    created_on = db.Column(db.Date, default=datetime.datetime.now())
    
    def __init__(self, user_id, photo, caption):
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True)
    location = db.Column(db.String(255))
    biography = db.Column(db.String(255))
    profile_photo = db.Column(db.String(255))
    joined_on = db.Column(db.Date, default=datetime.datetime.now())
    
    def __init__(self, username, password, firstname, lastname, email, 
                location, biography, profile_photo):
                    
                self.username = username
                self.password = password
                self.firstname = firstname
                self.lastname = lastname
                self.email = email
                self.location = location
                self.biography = biography
                self.profile_photo = profile_photo
    
class Like(db.Model):
    __tablename__ = 'likes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    
    def __init__(self, user_id, post_id):
        self.user_id = user_id
        self.post_id = post_id
        

class Follow(db.Model):
    __tablename__ = 'follows'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    def __init__(self, user_id, follower_id):
        self.user_id = user_id
        self.follower_id = follower_id
    