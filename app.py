from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p> Hello, World!</p>"


@app.route("/health")
def hello_health():
    return {
        "docker": {"status": "Ok", "Uptime": "200hr"},
    }
    # "<h1> Service Health </h1>",
