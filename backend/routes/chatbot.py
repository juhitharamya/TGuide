from flask import Blueprint, request, jsonify
import requests

chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')

WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1'


def get_wikipedia_summary(query):
    """Fetch a summary from Wikipedia (free, no API key needed)."""
    try:
        resp = requests.get(
            f'{WIKIPEDIA_API}/page/summary/{query}',
            timeout=5,
        )
        if resp.status_code == 200:
            data = resp.json()
            return data.get('extract', '')
    except Exception:
        pass
    return ''


def generate_response(message):
    """Generate a travel assistant response using keyword matching + Wikipedia."""
    lower = message.lower()

    destinations = {
        'goa': 'Goa', 'kerala': 'Kerala', 'rajasthan': 'Rajasthan',
        'himachal': 'Himachal_Pradesh', 'manali': 'Manali,_Himachal_Pradesh',
        'shimla': 'Shimla', 'tamil nadu': 'Tamil_Nadu', 'maharashtra': 'Maharashtra',
        'jaipur': 'Jaipur', 'mumbai': 'Mumbai', 'delhi': 'Delhi',
        'bangalore': 'Bangalore', 'hyderabad': 'Hyderabad', 'kolkata': 'Kolkata',
        'varanasi': 'Varanasi', 'agra': 'Agra', 'udaipur': 'Udaipur',
        'jaisalmer': 'Jaisalmer', 'rishikesh': 'Rishikesh', 'darjeeling': 'Darjeeling',
        'ooty': 'Ooty', 'munnar': 'Munnar', 'hampi': 'Hampi', 'mysore': 'Mysore',
        'pondicherry': 'Pondicherry', 'andaman': 'Andaman_and_Nicobar_Islands',
        'ladakh': 'Ladakh', 'leh': 'Leh',
    }

    matched_dest = None
    for keyword, wiki_title in destinations.items():
        if keyword in lower:
            matched_dest = wiki_title
            break

    if matched_dest:
        wiki_info = get_wikipedia_summary(matched_dest)
        dest_name = matched_dest.replace('_', ' ')
        return (
            f"📍 **{dest_name}**\n\n"
            f"{wiki_info[:400] if wiki_info else 'A wonderful destination in India!'}\n\n"
            "💡 Would you like to know more about:\n"
            "• 🏨 Hotels & accommodation\n"
            "• 🍽️ Restaurants & food\n"
            "• 💰 Budget estimation\n"
            "• 📅 Best time to visit"
        )

    if 'budget' in lower or 'cheap' in lower:
        return (
            "💰 **Budget Travel Tips:**\n\n"
            "🏆 Best Budget Destinations:\n"
            "1. Rishikesh - ₹8,000 for 3 days\n"
            "2. Hampi - ₹10,000 for 4 days\n"
            "3. Varanasi - ₹12,000 for 3 days\n\n"
            "Which destination interests you?"
        )

    if 'restaurant' in lower or 'food' in lower:
        return (
            "🍽️ **Top Restaurants:**\n\n"
            "📍 Delhi: Karim's, Indian Accent\n"
            "📍 Mumbai: Britannia, Trishna\n"
            "📍 Bangalore: MTR, Karavalli\n\n"
            "Which city interests you?"
        )

    if 'hill' in lower or 'mountain' in lower:
        return (
            "⛰️ **Best Hill Stations:**\n\n"
            "1. Manali\n2. Shimla\n3. Ooty\n4. Darjeeling\n5. Munnar\n\n"
            "💰 Budget: ₹15,000-30,000 per person"
        )

    if 'beach' in lower or 'sea' in lower:
        return (
            "🏖️ **Best Beaches:**\n\n"
            "1. Goa\n2. Andaman\n3. Kovalam\n4. Gokarna\n5. Pondicherry\n\n"
            "💰 Budget: ₹12,000-35,000 per person"
        )

    return (
        "👋 I'm your AI Travel Assistant! I can help with:\n\n"
        "✈️ Trip Planning — Tell me a destination\n"
        "🍽️ Restaurant Suggestions\n"
        "💰 Budget Estimation\n"
        "⛰️ Hill stations, 🏖️ Beaches\n\n"
        "Try: \"Plan a trip to Goa\" or \"Best hill stations\""
    )


@chatbot_bp.route('/message', methods=['POST'])
def send_message():
    """Send a message to the travel chatbot
    ---
    tags:
      - Chatbot
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [message]
          properties:
            message:
              type: string
              example: Plan my trip to Goa
    responses:
      200:
        description: Chatbot response with travel info (pulls from Wikipedia)
      400:
        description: Message is required
    """
    data = request.get_json()
    message = data.get('message', '')

    if not message.strip():
        return jsonify({'error': 'Message is required'}), 400

    response = generate_response(message)
    return jsonify({
        'message': response,
    }), 200


@chatbot_bp.route('/travel-plan', methods=['POST'])
def get_travel_plan():
    """Generate a travel plan
    ---
    tags:
      - Chatbot
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            destination:
              type: string
              example: Goa
            budget:
              type: string
              example: 20000
            duration:
              type: string
              example: 5 days
    responses:
      200:
        description: Generated travel plan
    """
    data = request.get_json()
    destination = data.get('destination', 'Unknown')
    budget = data.get('budget', 'Not specified')
    duration = data.get('duration', 'Not specified')

    wiki_info = get_wikipedia_summary(destination.replace(' ', '_'))
    desc = wiki_info[:200] + '...' if wiki_info else 'A beautiful destination to explore.'

    plan = (
        f"📋 **Travel Plan for {destination}**\n\n"
        f"ℹ️ {desc}\n\n"
        f"📅 Duration: {duration}\n"
        f"💰 Budget: {budget}\n\n"
        f"🗓️ Suggested Itinerary:\n"
        f"• Day 1: Arrival & local sightseeing\n"
        f"• Day 2: Major attractions & cultural sites\n"
        f"• Day 3: Adventure activities & local cuisine\n"
        f"• Final Day: Shopping & departure\n\n"
        f"💡 Tips: Book in advance, carry walking shoes"
    )

    return jsonify({'plan': plan}), 200
