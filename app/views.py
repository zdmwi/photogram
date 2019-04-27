import os
import jwt
from functools import wraps
from flask import render_template, request, jsonify
from app import app, db, csrf
from app.forms import RegisterForm, LoginForm, PostForm, FollowForm, LikeForm
from app.models import User, Post, Follow, Like
from werkzeug.utils import secure_filename

###
# Utility functions
###

def login_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
         payload = jwt.decode(token, app.config['SECRET_KEY'])

    except jwt.ExpiredSignature:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    return f(*args, **kwargs)

  return decorated

def form_errors(form):
    error_messages = []
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

###
# API endpoints
###

@app.route('/api/users/register', methods=['POST'])
def register():
    form = RegisterForm()
    
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        firstname = form.firstname.data
        lastname = form.lastname.data
        email = form.email.data
        location = form.location.data
        biography = form.biography.data
        profile_photo = form.profile_photo.data
        
        filename = secure_filename(profile_photo.filename)
        profile_photo.save(os.path.join(
            app.config['UPLOAD_FOLDER'], filename    
        ))
        
        user = User(username, password, firstname, lastname, email, location, biography, filename)
        
        db.session.add(user)
        db.session.commit()
 
        response = { 'message': 'User registered successfully!'}, 201
    else:
        response = { 'errors': form_errors(form) }, 400
        
    return jsonify(response[0]), response[1]
    
@app.route('/api/auth/login', methods=['POST'])
def login():
    form = LoginForm()
    
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        
        # find a user with the same username and try to match the passwords
        user = User.query.filter_by(username=username).first()
        
        if user:
            if user.password == password:
                token = jwt.encode({'id': user.id, 'username': username}, app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')
                response = {'token': token, 'message': 'User successfully logged in!'}, 200
            else:
                response = {'errors': ['Incorrect username or password!']}, 400
        else:
            response = {'errors': ['Incorrect username or password!']}, 400
    else:
        response = {'errors': form_errors(form)}, 400
    
    return jsonify(response[0]), response[1]

@app.route('/api/auth/logout', methods=['GET'])
def logout():
    response = {'message': 'User successfully logged out!'}
    return jsonify(response), 200

@app.route('/api/users/<user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    user_posts = Post.query.filter_by(user_id=user_id).all()
    
    post_set = [{'id': post.id , 'user_id': post.user_id, 
                'photo': post.photo, 'caption': post.caption, 
                'created_on': post.created_on} for post in user_posts]
                
    user_data = {'id': user.id, 'username': user.username, 
                'firstname': user.firstname, 'lastname': user.lastname, 
                'email': user.email, 'location': user.location, 
                'biography': user.biography, 'profile_photo': user.profile_photo, 
                'joined_on': user.joined_on.strftime('%B %Y'), 'posts': post_set}
                
    return jsonify(user_data), 200

@app.route('/api/users/<user_id>/posts', methods=['GET', 'POST'])
@login_required
def posts(user_id):
    if request.method == 'POST':
        
        form = PostForm()
        if form.validate_on_submit():
            caption = form.caption.data
            
            photo = form.photo.data
            filename = photo.filename
            photo.save(os.path.join(
                app.config['UPLOAD_FOLDER'], filename
            ))
            
            
            post = Post(user_id, filename, caption)

            db.session.add(post)
            db.session.commit()
            
            response = {'message': 'Successfully created a post!'}, 201
        else:
            response = {'errors': form_errors(form)}, 400
            
    else:
        posts = Post.query.filter_by(user_id=user_id).all()
        response_set = [{'user_id': post.user_id, 'photo': post.photo, 'caption': post.caption} for post in posts]
        response = {'posts': response_set}, 200
        
    return jsonify(response[0]), response[1]
    
@app.route('/api/users/<user_id>/follow', methods=['GET', 'POST'])
@login_required
def follow(user_id):
    if request.method == 'POST':
        form = FollowForm()
        
        if form.validate_on_submit():
            follower_id = form.follower_id.data
            
            follow = Follow(user_id, follower_id)
            
            db.session.add(follow)
            db.session.commit()
            
            response = {'message': 'You are now following that user.'}, 200
        
        else:
            response = {'errors': form_errors(form)}, 400
    else:
        follows = Follow.query.filter_by(user_id=user_id).distinct().all()
        
        follow_count  = 0
        for follow in follows:
            follow_count += 1
        
        response = {'follower_count': follow_count}, 200
        
    return jsonify(response[0]), response[1]
 
@app.route('/api/posts', methods=['GET'])
@login_required
def all_posts():
    posts = Post.query.all()
    
    response_set = [{'id': post.id, 'user_id': post.user_id, 'photo': post.photo, 
                    'caption': post.caption, 'created_on': post.created_on.strftime('%d %B %Y')} for post in posts]
                    
    response = {'posts': response_set}
    return jsonify(response), 200

@app.route('/api/posts/<post_id>/like', methods=['GET', 'POST'])
@login_required
def likes(post_id):
    if request.method == 'POST':
        form = LikeForm()
        
        if form.validate_on_submit():
            user_id = form.user_id.data
            
            like = Like(user_id, post_id)
            
            db.session.add(like)
            db.session.commit()
            
            likes = Like.query.filter_by(post_id=post_id).all()
            response = {'message': 'Post liked!', 'likes': len(likes)}, 201
            
        else:
            response = {'errors': form_errors(form)}, 400
    else:
        likes = Like.query.filter_by(post_id=post_id).all()
        response = {'likes': len(likes)}, 200
        
    return jsonify(response[0]), response[1]

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

###
# The functions below should be applicable to all Flask apps.
###

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
