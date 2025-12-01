from extensions import db
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime

class Trainer(db.Model):
    __tablename__ = 'trainers'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    specialization = db.Column(db.String(200))
    bio = db.Column(db.Text)
    profile_image = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    clients = db.relationship('Client', backref='trainer', lazy=True, cascade='all, delete-orphan')
    workouts = db.relationship('Workout', backref='trainer', lazy=True, cascade='all, delete-orphan')
    schedules = db.relationship('Schedule', backref='trainer', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'specialization': self.specialization,
            'bio': self.bio,
            'profile_image': self.profile_image,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'client_count': len(self.clients)
        }

