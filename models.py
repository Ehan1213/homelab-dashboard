from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

from app import create_app


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)

app = create_app()

with app.app_context():
    db.create_all()
