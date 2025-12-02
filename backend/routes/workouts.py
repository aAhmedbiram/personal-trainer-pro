from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.workout import Workout, Exercise
from models.client import Client

workouts_bp = Blueprint('workouts', __name__)

@workouts_bp.route('', methods=['GET', 'POST'])
@jwt_required()
def workouts():
    trainer_id = get_jwt_identity()
    
    if request.method == 'GET':
        client_id = request.args.get('client_id')
        query = Workout.query.filter_by(trainer_id=trainer_id)
        
        if client_id:
            query = query.filter_by(client_id=client_id)
        
        workouts = query.all()
        return jsonify([workout.to_dict() for workout in workouts]), 200
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            
            # Verify client belongs to trainer
            client = Client.query.filter_by(id=data['client_id'], trainer_id=trainer_id).first()
            if not client:
                return jsonify({'error': 'Client not found'}), 404
            
            workout = Workout(
                trainer_id=trainer_id,
                client_id=data['client_id'],
                name=data['name'],
                description=data.get('description'),
                duration_minutes=data.get('duration_minutes'),
                difficulty_level=data.get('difficulty_level', 'intermediate')
            )
            
            db.session.add(workout)
            db.session.flush()  # Get workout.id
            
            # Add exercises
            if 'exercises' in data:
                for idx, ex_data in enumerate(data['exercises']):
                    exercise = Exercise(
                        workout_id=workout.id,
                        name=ex_data['name'],
                        description=ex_data.get('description'),
                        sets=ex_data.get('sets'),
                        reps=ex_data.get('reps'),
                        weight=ex_data.get('weight'),
                        rest_seconds=ex_data.get('rest_seconds'),
                        order=ex_data.get('order', idx),
                        notes=ex_data.get('notes')
                    )
                    db.session.add(exercise)
            
            db.session.commit()
            return jsonify(workout.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@workouts_bp.route('/<int:workout_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def workout_detail(workout_id):
    trainer_id = get_jwt_identity()
    workout = Workout.query.filter_by(id=workout_id, trainer_id=trainer_id).first()
    
    if not workout:
        return jsonify({'error': 'Workout not found'}), 404
    
    if request.method == 'GET':
        return jsonify(workout.to_dict()), 200
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            
            if 'name' in data:
                workout.name = data['name']
            if 'description' in data:
                workout.description = data['description']
            if 'duration_minutes' in data:
                workout.duration_minutes = data['duration_minutes']
            if 'difficulty_level' in data:
                workout.difficulty_level = data['difficulty_level']
            
            # Update exercises
            if 'exercises' in data:
                # Delete existing exercises
                Exercise.query.filter_by(workout_id=workout.id).delete()
                
                # Add new exercises
                for idx, ex_data in enumerate(data['exercises']):
                    exercise = Exercise(
                        workout_id=workout.id,
                        name=ex_data['name'],
                        description=ex_data.get('description'),
                        sets=ex_data.get('sets'),
                        reps=ex_data.get('reps'),
                        weight=ex_data.get('weight'),
                        rest_seconds=ex_data.get('rest_seconds'),
                        order=ex_data.get('order', idx),
                        notes=ex_data.get('notes')
                    )
                    db.session.add(exercise)
            
            db.session.commit()
            return jsonify(workout.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(workout)
            db.session.commit()
            return jsonify({'message': 'Workout deleted successfully'}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500



