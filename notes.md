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
    
## Docker setup 
    The dockerfile took a bit to setup since I was using uv instead of 
    pip, but I like it more. I learned a lot more from debugging the 
    image build and the compose rather than reading the docs. 
    I had a bug where my docker env path was off by one char making the 
    builds fail for seemingly no reason.


## Alembic Migrations
    I tried to set up migrations to have this project be more true to a
    real production project, but ran into some difficulties. My 
    SQLAlchemy engine is pointing to the docker container, so I would 
    need to run the migratiosn from inside the container which doesn't 
    have a persistance volume. The tables are now on the db though, and
    I have already moved back to using just the db.create_all().
    This was a misstep but not too terrible. If I were to setup
    migrations further I would point an app volume at my local working 
    dir for it to place the migrations for git to pick up.

  