from flask import Flask, jsonify, request
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
    # نسمح لكل الدومينات بدون قيود
    CORS(app, 
         resources={r"/*": {"origins": "*"}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         expose_headers=["Content-Type", "Authorization"])
    
    # معالجة OPTIONS requests يدوياً (preflight)
    @app.before_request
    def handle_preflight():
        if app.request.method == "OPTIONS":
            response = app.make_default_options_response()
            headers = response.headers
            headers['Access-Control-Allow-Origin'] = '*'
            headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
            headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
            headers['Access-Control-Max-Age'] = '3600'
            return response
    
    # إضافة CORS headers يدوياً للتأكد على كل response
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
        response.headers.add('Access-Control-Max-Age', '3600')
        return response

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