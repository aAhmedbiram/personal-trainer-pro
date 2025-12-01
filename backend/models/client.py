from extensions import db
from datetime import datetime

class Client(db.Model):
    __tablename__ = 'clients'
    
    id = db.Column(db.Integer, primary_key=True)
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id'), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(20))
    height = db.Column(db.Float)  # in cm
    weight = db.Column(db.Float)  # in kg
    fitness_goals = db.Column(db.Text)
    medical_notes = db.Column(db.Text)
    profile_image = db.Column(db.String(255))
    status = db.Column(db.String(20), default='active')  # active, inactive, archived
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workouts = db.relationship('Workout', backref='client', lazy=True, cascade='all, delete-orphan')
    schedules = db.relationship('Schedule', backref='client', lazy=True, cascade='all, delete-orphan')
    progress_entries = db.relationship('ProgressEntry', backref='client', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'trainer_id': self.trainer_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'gender': self.gender,
            'height': self.height,
            'weight': self.weight,
            'fitness_goals': self.fitness_goals,
            'medical_notes': self.medical_notes,
            'profile_image': self.profile_image,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

