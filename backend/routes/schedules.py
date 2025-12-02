from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.schedule import Schedule
from models.client import Client
from datetime import datetime

schedules_bp = Blueprint('schedules', __name__)

@schedules_bp.route('', methods=['GET', 'POST'])
@jwt_required()
def schedules():
    trainer_id = int(get_jwt_identity())
    
    if request.method == 'GET':
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        client_id = request.args.get('client_id')
        
        query = Schedule.query.filter_by(trainer_id=trainer_id)
        
        if client_id:
            query = query.filter_by(client_id=client_id)
        
        if start_date:
            query = query.filter(Schedule.start_time >= datetime.fromisoformat(start_date))
        
        if end_date:
            query = query.filter(Schedule.start_time <= datetime.fromisoformat(end_date))
        
        schedules = query.order_by(Schedule.start_time).all()
        return jsonify([schedule.to_dict() for schedule in schedules]), 200
    
    elif request.method == 'POST':
        try:
            data = request.get_json()

            # Normalize and validate IDs coming from JSON (often as strings)
            raw_client_id = data.get('client_id')
            if raw_client_id is None or str(raw_client_id).strip() == '':
                return jsonify({'error': 'client_id is required'}), 400
            client_id = int(raw_client_id)

            # workout_id is optional; treat empty string as NULL
            raw_workout_id = data.get('workout_id')
            workout_id = None
            if raw_workout_id not in (None, ''):
                workout_id = int(raw_workout_id)

            # Verify client belongs to trainer
            client = Client.query.filter_by(id=client_id, trainer_id=trainer_id).first()
            if not client:
                return jsonify({'error': 'Client not found'}), 404
            
            schedule = Schedule(
                trainer_id=trainer_id,
                client_id=client_id,
                workout_id=workout_id,
                title=data['title'],
                description=data.get('description'),
                start_time=datetime.fromisoformat(data['start_time']),
                end_time=datetime.fromisoformat(data['end_time']),
                status=data.get('status', 'scheduled'),
                location=data.get('location'),
                notes=data.get('notes')
            )
            
            db.session.add(schedule)
            db.session.commit()
            
            return jsonify(schedule.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@schedules_bp.route('/<int:schedule_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def schedule_detail(schedule_id):
    trainer_id = int(get_jwt_identity())
    schedule = Schedule.query.filter_by(id=schedule_id, trainer_id=trainer_id).first()
    
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404
    
    if request.method == 'GET':
        return jsonify(schedule.to_dict()), 200
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()

            # Normalize optional workout_id on update (empty string -> NULL)
            if 'workout_id' in data:
                raw_workout_id = data.get('workout_id')
                if raw_workout_id in (None, ''):
                    schedule.workout_id = None
                else:
                    schedule.workout_id = int(raw_workout_id)

            if 'title' in data:
                schedule.title = data['title']
            if 'description' in data:
                schedule.description = data['description']
            if 'start_time' in data:
                schedule.start_time = datetime.fromisoformat(data['start_time'])
            if 'end_time' in data:
                schedule.end_time = datetime.fromisoformat(data['end_time'])
            if 'status' in data:
                schedule.status = data['status']
            if 'location' in data:
                schedule.location = data['location']
            if 'notes' in data:
                schedule.notes = data['notes']
            
            db.session.commit()
            return jsonify(schedule.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(schedule)
            db.session.commit()
            return jsonify({'message': 'Schedule deleted successfully'}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500



