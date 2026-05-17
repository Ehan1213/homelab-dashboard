# Dev Journal
    A log of my notes things I learned making this

## Flask Scaffolding
    The blueprint and app factory pattern make a lot of sense actually 
    now that I have actually done them once. Additionally, the .env was 
    a trip to figure out. First, I was making 2 silly mistakes... I had 
    in my models.py `db = SQLAlchemy` instead of `db = SQLAlchemy()` so 
    I was referencing the class object instead of making an instance.
    The other silly mistake was a typo `app.config.from__pyfile` instead 
    of `app.config.from_pyfile`. 
    Next, I set up unit tests for the api endpoint 200 checks for GET 
    because
        1. I got tired of writing out curl
        2. I also wanted to dive into proper testing(mostly because of \
        curl)
    