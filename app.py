from dotenv import load_dotenv
from flask import Flask

from health import health

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile("config.py")

    from models import db

    db.init_app(app)

    app.register_blueprint(health)
    with app.app_context():
        db.create_all()
