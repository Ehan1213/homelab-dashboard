# Helpful links
[Flask Quickstart](https://flask.palletsprojects.com/en/stable/quickstart/)
[Application Factories](https://flask.palletsprojects.com/en/stable/patterns/appfactories/)
[Blueprints](https://flask.palletsprojects.com/en/stable/blueprints/)
[SQL Alchemy](https://flask-sqlalchemy.readthedocs.io/en/stable/)





# Flask basics

### App init 
```
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```

## Important
Must escape any html with 
```
from flask import request
from markupsafe import escape

@app.route("/hello")
def hello():
    name = request.args.get("name", "Flask")
    return f"Hello, {escape(name)}!
```
otherwise you get script injection
jinja templates handle this though.(this project won't use them)

## Routing 
## Varible routing 
varible routing lets you pipe the endpoint into functions as a kwarg
```
from markupsafe import escape

@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return f'User {escape(username)}'

@app.route('/post/<int:post_id>')
def show_post(post_id):
    # show the post with the given id, the id is an integer
    return f'Post {post_id}'

@app.route('/path/<path:subpath>')
def show_subpath(subpath):
    # show the subpath after /path/
    return f'Subpath {escape(subpath)}'
```
### Regular routing 
```
@app.route('/')
def index():
    return 'Index Page'

@app.route('/hello')
def hello():
    return 'Hello, World'
```

## Returning JSON

you can return json like this 
```
@app.route("/health")
def hello_health():
    return {
        "docker": {"status": "Ok", "Uptime": "200hr"},
    }
    # "<h1> Service Health </h1>",

```
looks like this 
```
➜  homelab-dashboard git:(main) ✗ curl http://127.0.0.1:5000/health
{
  "docker": {
    "Uptime": "200hr",
    "status": "Ok"
  }
}
➜  homelab-dashboard git:(main) ✗   
```

## Flask Application Factory
From my understanding this allows you to provision/scaffold the app's 
creation with a create app function allowing you to pass in blueprints
or config files -- what those look like idk currently. 