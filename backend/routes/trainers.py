from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.trainer import Trainer

trainers_bp = Blueprint('trainers', __name__)

@trainers_bp.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def trainer_profile():
    trainer_id = get_jwt_identity()
    trainer = Trainer.query.get(trainer_id)
    
    if not trainer:
        return jsonify({'error': 'Trainer not found'}), 404
    
    if request.method == 'GET':
        return jsonify(trainer.to_dict()), 200
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            
            if 'first_name' in data:
                trainer.first_name = data['first_name']
            if 'last_name' in data:
                trainer.last_name = data['last_name']
            if 'phone' in data:
                trainer.phone = data['phone']
            if 'specialization' in data:
                trainer.specialization = data['specialization']
            if 'bio' in data:
                trainer.bio = data['bio']
            if 'profile_image' in data:
                trainer.profile_image = data['profile_image']
            
            db.session.commit()
            return jsonify(trainer.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

