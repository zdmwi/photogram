from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, SelectField, TextAreaField
from wtforms.validators import InputRequired, Email


class RegisterForm(FlaskForm):
    username = StringField('username', validators=[InputRequired()])
    password = StringField('password', validators=[InputRequired()])
    firstname = StringField('firstname', validators=[InputRequired()])
    lastname = StringField('lastname', validators=[InputRequired()])
    email = StringField('email', validators=[InputRequired(), Email()])
    location = StringField('location', validators=[InputRequired()])
    biography = TextAreaField('biography', validators=[InputRequired()])
    profile_photo = FileField('profile_photo', validators=[FileRequired(),  FileAllowed(['jpg', 'png', 'Only images are accepted!'])])

class LoginForm(FlaskForm):
    class Meta:
        csrf = False
        
    username = StringField('username', validators=[InputRequired()])
    password = StringField('password', validators=[InputRequired()])