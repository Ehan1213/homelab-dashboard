from dotenv import load_dotenv
from flask import Flask

from app.blueprints.health import health
from app.blueprints.main import main
from app.blueprints.services import services

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile("utils/config.py")

    from app.models import db

    db.init_app(app)

    app.register_blueprint(health)
    app.register_blueprint(services)
    app.register_blueprint(main)
    with app.app_context():
        db.create_all()

    return app
