from flask import Blueprint

health = Blueprint("health", __name__)


@health.route("/health")
def hello_health():
    return {
        "docker": {"status": "Ok", "Uptime": "200hr"},
    }


@health.route("/readiness")
def hello_readiness():
    return "<h1>All Services Ready</h1>"
