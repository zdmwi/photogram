from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import TextAreaField
from wtforms.validators import InputRequired


class UploadForm(FlaskForm):
    description = TextAreaField('description', validators=[InputRequired()])
    photo = FileField('photo', validators=[FileRequired(), FileAllowed(['jpg', 'png', 'Images only!'])])

