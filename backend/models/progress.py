from extensions import db
from datetime import datetime

class ProgressEntry(db.Model):
    __tablename__ = 'progress_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    entry_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    weight = db.Column(db.Float)  # in kg
    body_fat_percentage = db.Column(db.Float)
    muscle_mass = db.Column(db.Float)  # in kg
    measurements = db.Column(db.JSON)  # {chest: 100, waist: 80, etc.}
    photos = db.Column(db.JSON)  # Array of photo URLs
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'entry_date': self.entry_date.isoformat() if self.entry_date else None,
            'weight': self.weight,
            'body_fat_percentage': self.body_fat_percentage,
            'muscle_mass': self.muscle_mass,
            'measurements': self.measurements,
            'photos': self.photos,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

