from flask import Blueprint

main = Blueprint("main", __name__)


@main.route("/")
def serve_static():
    from flask import redirect, url_for

    return redirect(url_for("static", filename="../static/index.html"))
