from flask import Blueprint, jsonify
from flask_cors import cross_origin
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from app.models import db

health = Blueprint("health", __name__)


@health.route("/health")
def hello_health():
    return jsonify(status="ok"), 200


@health.route("/readiness")
@cross_origin()
def query_db_readiness():
    try:
        db.session.execute(text("SELECT 1")).scalar()
        return jsonify(status="ok"), 200
    except OperationalError as err:
        return jsonify(error=str(err)), 503
