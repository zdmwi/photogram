import os
import json
from flask import render_template, jsonify
from app import app, db, csrf
from app.forms import RegisterForm, LoginForm
from app.models import User
from werkzeug.utils import secure_filename

###
# API endpoints
###

@app.route('/api/users/register', methods=['POST'])
# @csrf.exempt
def register():
    form = RegisterForm()
    
    if form.validate_on_submit():
        username = form.username.data
        firstname = form.firstname.data
        lastname = form.lastname.data
        password = form.password.data
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
@csrf.exempt
def login():
    form = LoginForm()
    
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        
        # find a user with the same username and try to match the passwords
        user = User.query.filter_by(username=username).first()
        
        if user:
            if user.password == password:
                response = {'token': 'tbd', 'message': 'User successfully logged in!'}, 200
            else:
                response = {'errors': ['Incorrect username or password!']}, 400
        else:
            response = {'errors': ['Incorrect username or password!']}, 400
    else:
        response = {'errors': form_errors(form)}, 400
    
    return jsonify(response[0]), response[1]


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')


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
