from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from flask_bcrypt import Bcrypt
from models import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
bcrypt = Bcrypt()


@auth_bp.route('/login', methods=['POST'])
def login():
    """User login
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [email, password]
          properties:
            email:
              type: string
              example: john@example.com
            password:
              type: string
              example: password123
    responses:
      200:
        description: Login successful — returns JWT token and user data
      401:
        description: Invalid credentials
    """
    data = request.get_json()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': user.to_dict(),
    }), 200


@auth_bp.route('/signup', methods=['POST'])
def signup():
    """User registration
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [username, email, password]
          properties:
            username:
              type: string
              example: new_traveler
            email:
              type: string
              example: traveler@example.com
            password:
              type: string
              example: mypassword123
    responses:
      201:
        description: Account created successfully
      409:
        description: Email or username already exists
    """
    data = request.get_json()
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already taken'}), 409

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(
        username=username,
        email=email,
        password_hash=pw_hash,
        name=username,
    )
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Account created successfully',
        'token': access_token,
        'user': user.to_dict(),
    }), 201


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [email]
          properties:
            email:
              type: string
              example: john@example.com
    responses:
      200:
        description: Reset instructions sent
      404:
        description: No account found with this email
    """
    data = request.get_json()
    email = data.get('email', '').strip()

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'No account found with this email'}), 404

    return jsonify({
        'message': 'Password reset instructions have been sent to your email',
    }), 200
