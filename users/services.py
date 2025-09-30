import csv
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CSV_FILE = os.path.join(BASE_DIR, "data", "users.csv")

def read_users():
    users = []
    with open(CSV_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            users.append(row)
    return users

def authenticate(username, password):
    users = read_users()
    for user in users:
        if user["username"] == username and user["password"] == password:
            return user
    return None
