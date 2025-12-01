from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from extensions import db
from routes.auth import auth_bp
from routes.trainers import trainers_bp
from routes.clients import clients_bp
from routes.workouts import workouts_bp
from routes.schedules import schedules_bp
from routes.progress import progress_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    JWTManager(app)

    # حل نهائي لمشكلة CORS مع Vercel + Railway
    # نسمح لكل الدومينات (بما فيهم personal-trainer-pro.vercel.app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(trainers_bp, url_prefix='/api/trainers')
    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(workouts_bp, url_prefix='/api/workouts')
    app.register_blueprint(schedules_bp, url_prefix='/api/schedules')
    app.register_blueprint(progress_bp, url_prefix='/api/progress')

    # Root route
    @app.route('/')
    def root():
        return jsonify({
            'message': 'Personal Trainer Pro API',
            'status': 'running',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'trainers': '/api/trainers',
                'clients': '/api/clients',
                'workouts': '/api/workouts',
                'schedules': '/api/schedules',
                'progress': '/api/progress'
            }
        }), 200

    # Create tables if not exist
    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)