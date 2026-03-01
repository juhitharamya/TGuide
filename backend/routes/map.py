from flask import Blueprint, request, jsonify, current_app
import requests
from models import TouristSpot, MapRestaurant

map_bp = Blueprint('map', __name__, url_prefix='/api/map')

OPENTRIPMAP_BASE = 'https://api.opentripmap.com/0.1/en/places'


@map_bp.route('/tourist-spots', methods=['GET'])
def get_tourist_spots():
    """Get tourist spots
    ---
    tags:
      - Map
    parameters:
      - name: latitude
        in: query
        type: number
        description: Latitude (optional — uses OpenTripMap if provided)
        default: 15.2993
      - name: longitude
        in: query
        type: number
        description: Longitude (optional)
        default: 74.1240
      - name: radius
        in: query
        type: integer
        description: Search radius in meters
        default: 50000
    responses:
      200:
        description: List of tourist spots
    """
    lat = request.args.get('latitude', type=float)
    lng = request.args.get('longitude', type=float)
    radius = request.args.get('radius', 50000, type=int)
    api_key = current_app.config.get('OPENTRIPMAP_API_KEY', '')

    if lat and lng and api_key:
        try:
            resp = requests.get(
                f'{OPENTRIPMAP_BASE}/radius',
                params={
                    'radius': radius, 'lon': lng, 'lat': lat,
                    'kinds': 'interesting_places,historic,cultural,architecture',
                    'rate': 3, 'limit': 20, 'apikey': api_key,
                },
                timeout=5,
            )
            if resp.status_code == 200:
                places = resp.json()
                results = []
                for place in places:
                    if place.get('name'):
                        results.append({
                            'id': place.get('xid', ''),
                            'name': place['name'],
                            'type': 'monument',
                            'coordinates': {
                                'latitude': place['point']['lat'],
                                'longitude': place['point']['lon'],
                            },
                            'description': place.get('kinds', '').replace(',', ', '),
                        })
                if results:
                    return jsonify(results), 200
        except Exception as e:
            print(f"OpenTripMap API error: {e}")

    spots = TouristSpot.query.all()
    return jsonify([s.to_dict() for s in spots]), 200


@map_bp.route('/restaurants', methods=['GET'])
def get_restaurants():
    """Get restaurants
    ---
    tags:
      - Map
    parameters:
      - name: latitude
        in: query
        type: number
        description: Latitude (optional)
      - name: longitude
        in: query
        type: number
        description: Longitude (optional)
    responses:
      200:
        description: List of restaurants
    """
    lat = request.args.get('latitude', type=float)
    lng = request.args.get('longitude', type=float)
    radius = request.args.get('radius', 50000, type=int)
    api_key = current_app.config.get('OPENTRIPMAP_API_KEY', '')

    if lat and lng and api_key:
        try:
            resp = requests.get(
                f'{OPENTRIPMAP_BASE}/radius',
                params={
                    'radius': radius, 'lon': lng, 'lat': lat,
                    'kinds': 'restaurants,cafes,fast_food',
                    'limit': 20, 'apikey': api_key,
                },
                timeout=5,
            )
            if resp.status_code == 200:
                places = resp.json()
                results = []
                for place in places:
                    if place.get('name'):
                        results.append({
                            'id': place.get('xid', ''),
                            'name': place['name'],
                            'type': 'restaurant',
                            'coordinates': {
                                'latitude': place['point']['lat'],
                                'longitude': place['point']['lon'],
                            },
                            'cuisine': place.get('kinds', '').replace(',', ', '),
                            'rating': place.get('rate', 4.0),
                        })
                if results:
                    return jsonify(results), 200
        except Exception as e:
            print(f"OpenTripMap API error: {e}")

    restaurants = MapRestaurant.query.all()
    return jsonify([r.to_dict() for r in restaurants]), 200


@map_bp.route('/weather', methods=['GET'])
def get_weather():
    """Get weather for a location
    ---
    tags:
      - Map
    parameters:
      - name: latitude
        in: query
        type: number
        required: true
        default: 15.2993
      - name: longitude
        in: query
        type: number
        required: true
        default: 74.1240
    responses:
      200:
        description: Current weather data
    """
    lat = request.args.get('latitude', type=float)
    lng = request.args.get('longitude', type=float)

    if not lat or not lng:
        return jsonify({'error': 'latitude and longitude are required'}), 400

    api_key = current_app.config.get('OPENWEATHER_API_KEY', '')
    if not api_key or api_key == 'your_openweather_api_key_here':
        return jsonify({
            'temperature': 28, 'description': 'Clear sky',
            'humidity': 65, 'wind_speed': 12, 'icon': '01d',
        }), 200

    try:
        resp = requests.get(
            'https://api.openweathermap.org/data/2.5/weather',
            params={'lat': lat, 'lon': lng, 'appid': api_key, 'units': 'metric'},
            timeout=5,
        )
        if resp.status_code == 200:
            data = resp.json()
            return jsonify({
                'temperature': round(data['main']['temp']),
                'description': data['weather'][0]['description'],
                'humidity': data['main']['humidity'],
                'wind_speed': round(data['wind']['speed']),
                'icon': data['weather'][0]['icon'],
                'city': data.get('name', ''),
            }), 200
        return jsonify({'error': 'Failed to fetch weather'}), resp.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500
