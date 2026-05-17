import os

DB_URL = os.getenv("DB_URL", "localhost")
API_KEY = os.getenv("API_KEY")

print(DB_URL)
