from flask import Blueprint, jsonify
from models import State

states_bp = Blueprint('states', __name__, url_prefix='/api/states')


@states_bp.route('', methods=['GET'])
def get_states():
    """Get all Indian states
    ---
    tags:
      - States
    responses:
      200:
        description: List of all states with summary info
    """
    states = State.query.all()
    return jsonify([s.to_summary_dict() for s in states]), 200


@states_bp.route('/<int:state_id>', methods=['GET'])
def get_state_details(state_id):
    """Get state details by ID
    ---
    tags:
      - States
    parameters:
      - name: state_id
        in: path
        type: integer
        required: true
        description: State ID (1-6)
        default: 1
    responses:
      200:
        description: Full state details with attractions and restaurants
      404:
        description: State not found
    """
    state = State.query.get(state_id)
    if not state:
        return jsonify({'error': 'State not found'}), 404
    return jsonify(state.to_dict()), 200
