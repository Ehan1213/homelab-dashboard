# Homelab Dashboard

This project is a dashbaord to monitor my homelab.
The app ultizes a containerized flask + postgres backend with a 
vanilla js frontend to display key health info about my running services.



# Flask Dockerfiles
    I used uv in this project if you are less familiar there is a pip
    dockerfile with the requrired deps in a traditional requirements.txt
    this must be kept in sync manually.


# Future Work
- Add joinedload for related service data on check queries
- Python Background worker