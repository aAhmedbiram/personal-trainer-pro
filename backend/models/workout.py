from extensions import db
from datetime import datetime

class Workout(db.Model):
    __tablename__ = 'workouts'
    
    id = db.Column(db.Integer, primary_key=True)
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    duration_minutes = db.Column(db.Integer)
    difficulty_level = db.Column(db.String(20))  # beginner, intermediate, advanced
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    exercises = db.relationship('Exercise', backref='workout', lazy=True, cascade='all, delete-orphan', order_by='Exercise.order')
    
    def to_dict(self):
        return {
            'id': self.id,
            'trainer_id': self.trainer_id,
            'client_id': self.client_id,
            'name': self.name,
            'description': self.description,
            'duration_minutes': self.duration_minutes,
            'difficulty_level': self.difficulty_level,
            'exercises': [exercise.to_dict() for exercise in self.exercises],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Exercise(db.Model):
    __tablename__ = 'exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    sets = db.Column(db.Integer)
    reps = db.Column(db.String(50))  # Can be "10-12" or "30 seconds" etc.
    weight = db.Column(db.Float)  # in kg
    rest_seconds = db.Column(db.Integer)
    order = db.Column(db.Integer, default=0)
    notes = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'workout_id': self.workout_id,
            'name': self.name,
            'description': self.description,
            'sets': self.sets,
            'reps': self.reps,
            'weight': self.weight,
            'rest_seconds': self.rest_seconds,
            'order': self.order,
            'notes': self.notes
        }



