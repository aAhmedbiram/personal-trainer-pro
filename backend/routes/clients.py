from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.client import Client
from models.trainer import Trainer
from datetime import datetime

clients_bp = Blueprint('clients', __name__)

@clients_bp.route('', methods=['GET', 'POST'])
@jwt_required()
def clients():
    trainer_id = get_jwt_identity()
    trainer = Trainer.query.get(trainer_id)
    
    if not trainer:
        return jsonify({'error': 'Trainer not found'}), 404
    
    if request.method == 'GET':
        status = request.args.get('status', 'active')
        clients = Client.query.filter_by(trainer_id=trainer_id, status=status).all()
        return jsonify([client.to_dict() for client in clients]), 200
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            
            # Parse date_of_birth if provided
            date_of_birth = None
            if data.get('date_of_birth'):
                date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
            
            client = Client(
                trainer_id=trainer_id,
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data.get('email'),
                phone=data.get('phone'),
                date_of_birth=date_of_birth,
                gender=data.get('gender'),
                height=data.get('height'),
                weight=data.get('weight'),
                fitness_goals=data.get('fitness_goals'),
                medical_notes=data.get('medical_notes'),
                profile_image=data.get('profile_image'),
                status=data.get('status', 'active')
            )
            
            db.session.add(client)
            db.session.commit()
            
            return jsonify(client.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@clients_bp.route('/<int:client_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def client_detail(client_id):
    trainer_id = get_jwt_identity()
    client = Client.query.filter_by(id=client_id, trainer_id=trainer_id).first()
    
    if not client:
        return jsonify({'error': 'Client not found'}), 404
    
    if request.method == 'GET':
        return jsonify(client.to_dict()), 200
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            
            if 'first_name' in data:
                client.first_name = data['first_name']
            if 'last_name' in data:
                client.last_name = data['last_name']
            if 'email' in data:
                client.email = data['email']
            if 'phone' in data:
                client.phone = data['phone']
            if 'date_of_birth' in data:
                client.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
            if 'gender' in data:
                client.gender = data['gender']
            if 'height' in data:
                client.height = data['height']
            if 'weight' in data:
                client.weight = data['weight']
            if 'fitness_goals' in data:
                client.fitness_goals = data['fitness_goals']
            if 'medical_notes' in data:
                client.medical_notes = data['medical_notes']
            if 'profile_image' in data:
                client.profile_image = data['profile_image']
            if 'status' in data:
                client.status = data['status']
            
            db.session.commit()
            return jsonify(client.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(client)
            db.session.commit()
            return jsonify({'message': 'Client deleted successfully'}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

