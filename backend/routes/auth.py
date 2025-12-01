from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.trainer import Trainer
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if trainer already exists
        if Trainer.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new trainer
        trainer = Trainer(
            email=data['email'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            phone=data.get('phone'),
            specialization=data.get('specialization'),
            bio=data.get('bio')
        )
        trainer.set_password(data['password'])
        
        db.session.add(trainer)
        db.session.commit()
        
        # Generate token
        access_token = create_access_token(identity=trainer.id)
        
        return jsonify({
            'message': 'Registration successful',
            'token': access_token,
            'trainer': trainer.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        trainer = Trainer.query.filter_by(email=data['email']).first()
        
        if not trainer or not trainer.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=trainer.id)
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'trainer': trainer.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_trainer():
    try:
        trainer_id = get_jwt_identity()
        trainer = Trainer.query.get(trainer_id)
        
        if not trainer:
            return jsonify({'error': 'Trainer not found'}), 404
        
        return jsonify(trainer.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

