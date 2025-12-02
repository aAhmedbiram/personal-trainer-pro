"""
Database initialization script.
Run this script to create all database tables.
Make sure your .env file is configured with the correct DATABASE_URL.
"""

from app import create_app
from extensions import db

app = create_app()

with app.app_context():
    db.create_all()
    print("Database tables created successfully!")
    print("You can now start the application with: python app.py")



