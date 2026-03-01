from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flasgger import Swagger
from config import Config
from models import db
from seed_data import seed_database

# Import blueprints
from routes.auth import auth_bp
from routes.states import states_bp
from routes.posts import posts_bp
from routes.chatbot import chatbot_bp
from routes.map import map_bp
from routes.profile import profile_bp

# Swagger/OpenAPI configuration
SWAGGER_TEMPLATE = {
    "info": {
        "title": "TGuide Travel API",
        "description": "Backend API for the TGuide India Travel Guide app. "
                       "Test all endpoints interactively below.",
        "version": "1.0.0",
        "contact": {"name": "TGuide Team"},
    },
    "basePath": "/api",
    "schemes": ["http"],
    "tags": [
        {"name": "Health", "description": "Server status"},
        {"name": "Auth", "description": "Authentication & user mgmt"},
        {"name": "States", "description": "Indian states data"},
        {"name": "Posts", "description": "Travel posts & social features"},
        {"name": "Chatbot", "description": "AI travel assistant"},
        {"name": "Map", "description": "Tourist spots, restaurants & weather"},
        {"name": "Profile", "description": "User profile & saved plans"},
    ],
}

SWAGGER_CONFIG = {
    "headers": [],
    "specs": [
        {
            "endpoint": "apispec",
            "route": "/api/apispec.json",
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/api/docs",
}


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    CORS(app)
    JWTManager(app)
    Bcrypt(app)
    Swagger(app, template=SWAGGER_TEMPLATE, config=SWAGGER_CONFIG)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(states_bp)
    app.register_blueprint(posts_bp)
    app.register_blueprint(chatbot_bp)
    app.register_blueprint(map_bp)
    app.register_blueprint(profile_bp)

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health():
        """Server health check
        ---
        tags:
          - Health
        responses:
          200:
            description: API is running
            schema:
              properties:
                status:
                  type: string
                  example: ok
                message:
                  type: string
                  example: TGuide API is running
        """
        return {'status': 'ok', 'message': 'TGuide API is running'}, 200

    # Create tables and seed data
    with app.app_context():
        db.create_all()
        seed_database(app)

    return app


if __name__ == '__main__':
    app = create_app()
    print("=" * 50)
    print("  TGuide Backend API")
    print("  Running on http://localhost:8000")
    print("  Swagger Docs: http://localhost:8000/api/docs")
    print("=" * 50)
    app.run(host='0.0.0.0', port=8000, debug=True)
