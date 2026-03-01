from flask import Blueprint, request, jsonify
from models import db, User, SavedPlan

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')


@profile_bp.route('/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    """Get user profile
    ---
    tags:
      - Profile
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        default: 1
    responses:
      200:
        description: User profile with posts and saved plans
      404:
        description: User not found
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    profile = user.to_dict()
    profile['posts'] = [p.post_image for p in user.posts]
    profile['savedPlans'] = [sp.to_dict() for sp in user.saved_plans]
    return jsonify(profile), 200


@profile_bp.route('/<int:user_id>', methods=['PUT'])
def update_profile(user_id):
    """Update user profile
    ---
    tags:
      - Profile
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        default: 1
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
              example: John Updated
            username:
              type: string
              example: john_updated
            bio:
              type: string
              example: Love traveling across India!
    responses:
      200:
        description: Profile updated
      404:
        description: User not found
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    if 'name' in data:
        user.name = data['name']
    if 'username' in data:
        existing = User.query.filter_by(username=data['username']).first()
        if existing and existing.id != user.id:
            return jsonify({'error': 'Username already taken'}), 409
        user.username = data['username']
    if 'bio' in data:
        user.bio = data['bio']
    if 'profileImage' in data:
        user.profile_image = data['profileImage']

    db.session.commit()

    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict(),
    }), 200


@profile_bp.route('/<int:user_id>/saved-plans', methods=['GET'])
def get_saved_plans(user_id):
    """Get user's saved travel plans
    ---
    tags:
      - Profile
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        default: 1
    responses:
      200:
        description: List of saved travel plans
      404:
        description: User not found
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    plans = SavedPlan.query.filter_by(user_id=user_id).all()
    return jsonify([p.to_dict() for p in plans]), 200
