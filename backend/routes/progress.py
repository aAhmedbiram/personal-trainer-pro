from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.progress import ProgressEntry
from models.client import Client
from datetime import datetime

progress_bp = Blueprint('progress', __name__)

@progress_bp.route('', methods=['GET', 'POST'])
@jwt_required()
def progress_entries():
    trainer_id = get_jwt_identity()
    
    if request.method == 'GET':
        client_id = request.args.get('client_id')
        
        if not client_id:
            return jsonify({'error': 'client_id is required'}), 400
        
        # Verify client belongs to trainer
        client = Client.query.filter_by(id=client_id, trainer_id=trainer_id).first()
        if not client:
            return jsonify({'error': 'Client not found'}), 404
        
        entries = ProgressEntry.query.filter_by(client_id=client_id).order_by(ProgressEntry.entry_date.desc()).all()
        return jsonify([entry.to_dict() for entry in entries]), 200
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            client_id = data.get('client_id')
            
            if not client_id:
                return jsonify({'error': 'client_id is required'}), 400
            
            # Verify client belongs to trainer
            client = Client.query.filter_by(id=client_id, trainer_id=trainer_id).first()
            if not client:
                return jsonify({'error': 'Client not found'}), 404
            
            entry_date = datetime.strptime(data['entry_date'], '%Y-%m-%d').date() if data.get('entry_date') else datetime.utcnow().date()
            
            entry = ProgressEntry(
                client_id=client_id,
                entry_date=entry_date,
                weight=data.get('weight'),
                body_fat_percentage=data.get('body_fat_percentage'),
                muscle_mass=data.get('muscle_mass'),
                measurements=data.get('measurements'),
                photos=data.get('photos'),
                notes=data.get('notes')
            )
            
            db.session.add(entry)
            db.session.commit()
            
            return jsonify(entry.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@progress_bp.route('/<int:entry_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def progress_entry_detail(entry_id):
    trainer_id = get_jwt_identity()
    
    entry = ProgressEntry.query.get(entry_id)
    if not entry:
        return jsonify({'error': 'Progress entry not found'}), 404
    
    # Verify client belongs to trainer
    client = Client.query.filter_by(id=entry.client_id, trainer_id=trainer_id).first()
    if not client:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        return jsonify(entry.to_dict()), 200
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            
            if 'entry_date' in data:
                entry.entry_date = datetime.strptime(data['entry_date'], '%Y-%m-%d').date()
            if 'weight' in data:
                entry.weight = data['weight']
            if 'body_fat_percentage' in data:
                entry.body_fat_percentage = data['body_fat_percentage']
            if 'muscle_mass' in data:
                entry.muscle_mass = data['muscle_mass']
            if 'measurements' in data:
                entry.measurements = data['measurements']
            if 'photos' in data:
                entry.photos = data['photos']
            if 'notes' in data:
                entry.notes = data['notes']
            
            db.session.commit()
            return jsonify(entry.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(entry)
            db.session.commit()
            return jsonify({'message': 'Progress entry deleted successfully'}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500



