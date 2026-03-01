from flask_bcrypt import Bcrypt
from models import (
    db, User, State, TouristAttraction, StateRestaurant,
    Post, SavedPlan, TouristSpot, MapRestaurant,
)
from datetime import datetime, timedelta, timezone

bcrypt = Bcrypt()


def seed_database(app):
    """Seed the database with initial data matching the frontend DummyData.ts."""
    with app.app_context():
        # Skip seeding if data already exists
        if User.query.first():
            return

        print("Seeding database...")

        # --- Create default user ---
        pw_hash = bcrypt.generate_password_hash('password123').decode('utf-8')
        user = User(
            username='johndoe_traveler',
            email='john@example.com',
            password_hash=pw_hash,
            name='John Doe',
            bio='✈️ Travel Enthusiast | 📸 Photographer\n🌏 Exploring India one state at a time',
            profile_image='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
            followers=1234,
            following=567,
        )
        db.session.add(user)
        db.session.flush()

        # --- Additional users for posts ---
        users_data = [
            {
                'username': 'traveler_raj',
                'email': 'raj@example.com',
                'name': 'Raj Kumar',
                'profile_image': 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
            },
            {
                'username': 'wanderlust_priya',
                'email': 'priya@example.com',
                'name': 'Priya Sharma',
                'profile_image': 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
            },
            {
                'username': 'explorer_amit',
                'email': 'amit@example.com',
                'name': 'Amit Patel',
                'profile_image': 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
            },
            {
                'username': 'mountain_girl',
                'email': 'mountain@example.com',
                'name': 'Mountain Girl',
                'profile_image': 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
            },
            {
                'username': 'culture_seeker',
                'email': 'culture@example.com',
                'name': 'Culture Seeker',
                'profile_image': 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
            },
        ]

        post_users = []
        for u_data in users_data:
            u = User(
                username=u_data['username'],
                email=u_data['email'],
                password_hash=pw_hash,
                name=u_data['name'],
                profile_image=u_data['profile_image'],
            )
            db.session.add(u)
            post_users.append(u)

        db.session.flush()

        # --- Indian States ---
        states_data = [
            {
                'name': 'Goa',
                'image': 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800',
                'culture': 'Portuguese-influenced coastal culture with vibrant nightlife',
                'festivals': 'Carnival, Shigmo, Christmas',
                'famous_places': 'Baga Beach, Fort Aguada, Dudhsagar Falls',
                'budget': '₹15,000 - ₹30,000 per person for 3-4 days',
                'best_time': 'November to February',
                'latitude': 15.2993,
                'longitude': 74.1240,
                'attractions': [
                    ('Baga Beach', 'Popular beach with water sports'),
                    ('Fort Aguada', 'Historic Portuguese fort'),
                    ('Dudhsagar Falls', 'Majestic four-tiered waterfall'),
                    ('Basilica of Bom Jesus', 'UNESCO World Heritage Site'),
                ],
                'restaurants': [
                    ('Thalassa', 'Greek', 4.5),
                    ('Brittos', 'Seafood', 4.3),
                    ("Fisherman's Wharf", 'Goan', 4.4),
                ],
            },
            {
                'name': 'Kerala',
                'image': 'https://images.pexels.com/photos/3452356/pexels-photo-3452356.jpeg?auto=compress&cs=tinysrgb&w=800',
                'culture': 'Rich cultural heritage with classical arts and backwaters',
                'festivals': 'Onam, Vishu, Thrissur Pooram',
                'famous_places': 'Munnar, Alleppey Backwaters, Kovalam Beach',
                'budget': '₹20,000 - ₹40,000 per person for 5-6 days',
                'best_time': 'October to March',
                'latitude': 10.8505,
                'longitude': 76.2711,
                'attractions': [
                    ('Munnar Tea Gardens', 'Scenic hill station with tea plantations'),
                    ('Alleppey Backwaters', 'Houseboat cruises through backwaters'),
                    ('Kovalam Beach', 'Beautiful crescent-shaped beach'),
                    ('Periyar Wildlife Sanctuary', 'Elephant and tiger reserve'),
                ],
                'restaurants': [
                    ('Dhe Puttu', 'Kerala Traditional', 4.6),
                    ('Kayees Rahmathulla Hotel', 'Biryani', 4.5),
                    ('Paragon Restaurant', 'Seafood', 4.4),
                ],
            },
            {
                'name': 'Rajasthan',
                'image': 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
                'culture': 'Royal heritage with magnificent forts and palaces',
                'festivals': 'Pushkar Fair, Desert Festival, Teej',
                'famous_places': 'Jaipur, Udaipur, Jaisalmer',
                'budget': '₹25,000 - ₹50,000 per person for 7 days',
                'best_time': 'October to March',
                'latitude': 27.0238,
                'longitude': 74.2179,
                'attractions': [
                    ('Amber Fort', 'Majestic hilltop fort in Jaipur'),
                    ('City Palace Udaipur', 'Royal palace on Lake Pichola'),
                    ('Jaisalmer Fort', 'Living fort in the desert'),
                    ('Hawa Mahal', 'Iconic Palace of Winds'),
                ],
                'restaurants': [
                    ('Chokhi Dhani', 'Rajasthani', 4.5),
                    ('Laxmi Mishtan Bhandar', 'Sweets & Snacks', 4.6),
                    ('Ambrai Restaurant', 'Multi-cuisine', 4.7),
                ],
            },
            {
                'name': 'Himachal Pradesh',
                'image': 'https://images.pexels.com/photos/2531608/pexels-photo-2531608.jpeg?auto=compress&cs=tinysrgb&w=800',
                'culture': 'Mountain culture with Buddhist influences',
                'festivals': 'Kullu Dussehra, Losar, Summer Festival',
                'famous_places': 'Manali, Shimla, Dharamshala',
                'budget': '₹18,000 - ₹35,000 per person for 5 days',
                'best_time': 'March to June, September to December',
                'latitude': 31.1048,
                'longitude': 77.1734,
                'attractions': [
                    ('Rohtang Pass', 'High mountain pass with snow'),
                    ('Mall Road Shimla', 'Colonial-era shopping street'),
                    ('McLeod Ganj', 'Home of Dalai Lama'),
                    ('Solang Valley', 'Adventure sports destination'),
                ],
                'restaurants': [
                    ("Johnson's Cafe", 'Continental', 4.4),
                    ('Cafe 1947', 'Italian', 4.5),
                    ('The Himalayan Cafe', 'Multi-cuisine', 4.3),
                ],
            },
            {
                'name': 'Tamil Nadu',
                'image': 'https://images.pexels.com/photos/3401920/pexels-photo-3401920.jpeg?auto=compress&cs=tinysrgb&w=800',
                'culture': 'Ancient Dravidian culture with grand temples',
                'festivals': 'Pongal, Karthigai Deepam, Mahamaham',
                'famous_places': 'Mahabalipuram, Madurai, Ooty',
                'budget': '₹15,000 - ₹30,000 per person for 5 days',
                'best_time': 'November to February',
                'latitude': 11.1271,
                'longitude': 78.6569,
                'attractions': [
                    ('Meenakshi Temple', 'Magnificent temple complex'),
                    ('Shore Temple', 'UNESCO World Heritage Site'),
                    ('Nilgiri Mountain Railway', 'Historic toy train ride'),
                    ('Marina Beach', 'Longest urban beach in India'),
                ],
                'restaurants': [
                    ('Murugan Idli Shop', 'South Indian', 4.5),
                    ('Sangeetha Restaurant', 'Vegetarian', 4.4),
                    ('Buhari Hotel', 'Biryani', 4.3),
                ],
            },
            {
                'name': 'Maharashtra',
                'image': 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg?auto=compress&cs=tinysrgb&w=800',
                'culture': 'Diverse culture blending tradition and modernity',
                'festivals': 'Ganesh Chaturthi, Gudi Padwa, Diwali',
                'famous_places': 'Mumbai, Pune, Ajanta Caves',
                'budget': '₹20,000 - ₹40,000 per person for 5 days',
                'best_time': 'October to February',
                'latitude': 19.7515,
                'longitude': 75.7139,
                'attractions': [
                    ('Gateway of India', 'Iconic Mumbai monument'),
                    ('Ajanta & Ellora Caves', 'Ancient rock-cut caves'),
                    ('Lonavala', 'Hill station near Mumbai'),
                    ('Marine Drive', 'Scenic coastal promenade'),
                ],
                'restaurants': [
                    ('Britannia & Co.', 'Parsi', 4.5),
                    ('Cafe Mondegar', 'Continental', 4.3),
                    ('Trishna', 'Seafood', 4.6),
                ],
            },
        ]

        for s_data in states_data:
            state = State(
                name=s_data['name'],
                image=s_data['image'],
                culture=s_data['culture'],
                festivals=s_data['festivals'],
                famous_places=s_data['famous_places'],
                budget=s_data['budget'],
                best_time=s_data['best_time'],
                latitude=s_data['latitude'],
                longitude=s_data['longitude'],
            )
            db.session.add(state)
            db.session.flush()

            for attr_name, attr_desc in s_data['attractions']:
                db.session.add(TouristAttraction(
                    state_id=state.id,
                    name=attr_name,
                    description=attr_desc,
                ))

            for r_name, r_cuisine, r_rating in s_data['restaurants']:
                db.session.add(StateRestaurant(
                    state_id=state.id,
                    name=r_name,
                    cuisine=r_cuisine,
                    rating=r_rating,
                ))

        # --- Posts ---
        now = datetime.now(timezone.utc)
        posts_data = [
            {
                'user': post_users[0],
                'image': 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800',
                'caption': 'Sunset at Baga Beach was absolutely magical! 🌅 #GoaDiaries',
                'location': 'Baga Beach, Goa',
                'likes': 234,
                'comments_count': 45,
                'hours_ago': 2,
                'is_liked': False,
            },
            {
                'user': post_users[1],
                'image': 'https://images.pexels.com/photos/3452356/pexels-photo-3452356.jpeg?auto=compress&cs=tinysrgb&w=800',
                'caption': 'Houseboat experience in Kerala backwaters - a dream come true! 🚤',
                'location': 'Alleppey, Kerala',
                'likes': 567,
                'comments_count': 89,
                'hours_ago': 5,
                'is_liked': True,
            },
            {
                'user': post_users[2],
                'image': 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
                'caption': 'The royal Amber Fort never fails to amaze! 🏰',
                'location': 'Jaipur, Rajasthan',
                'likes': 892,
                'comments_count': 156,
                'hours_ago': 24,
                'is_liked': False,
            },
            {
                'user': post_users[3],
                'image': 'https://images.pexels.com/photos/2531608/pexels-photo-2531608.jpeg?auto=compress&cs=tinysrgb&w=800',
                'caption': 'Breathing in the fresh Himalayan air at Manali ⛰️',
                'location': 'Manali, Himachal Pradesh',
                'likes': 445,
                'comments_count': 67,
                'hours_ago': 48,
                'is_liked': True,
            },
            {
                'user': post_users[4],
                'image': 'https://images.pexels.com/photos/3401920/pexels-photo-3401920.jpeg?auto=compress&cs=tinysrgb&w=800',
                'caption': 'The intricate architecture of Meenakshi Temple is breathtaking! 🕉️',
                'location': 'Madurai, Tamil Nadu',
                'likes': 678,
                'comments_count': 92,
                'hours_ago': 72,
                'is_liked': False,
            },
        ]

        for p_data in posts_data:
            post = Post(
                user_id=p_data['user'].id,
                post_image=p_data['image'],
                caption=p_data['caption'],
                location=p_data['location'],
                likes=p_data['likes'],
                comments_count=p_data['comments_count'],
                is_liked=p_data['is_liked'],
                created_at=now - timedelta(hours=p_data['hours_ago']),
            )
            db.session.add(post)

        # --- Saved Plans for default user ---
        plans = [
            ('Goa Beach Tour', '3 Days', '₹25,000'),
            ('Kerala Backwaters', '5 Days', '₹40,000'),
            ('Rajasthan Heritage', '7 Days', '₹50,000'),
        ]
        for dest, dur, bud in plans:
            db.session.add(SavedPlan(
                user_id=user.id,
                destination=dest,
                duration=dur,
                budget=bud,
            ))

        # --- Tourist Spots (for map) ---
        spots = [
            ('Taj Mahal', 'monument', 'Iconic white marble mausoleum', 27.1751, 78.0421),
            ('Gateway of India', 'monument', 'Historic arch monument in Mumbai', 18.9220, 72.8347),
            ('Hawa Mahal', 'monument', 'Palace of Winds in Jaipur', 26.9239, 75.8267),
        ]
        for s_name, s_type, s_desc, s_lat, s_lng in spots:
            db.session.add(TouristSpot(
                name=s_name, type=s_type, description=s_desc,
                latitude=s_lat, longitude=s_lng,
            ))

        # --- Map Restaurants ---
        map_rests = [
            ('Paradise Biryani', 'restaurant', 'Hyderabadi', 4.5, 17.4399, 78.3486),
            ("Karim's", 'restaurant', 'Mughlai', 4.6, 28.6508, 77.2318),
            ('MTR', 'restaurant', 'South Indian', 4.7, 12.9716, 77.5946),
        ]
        for r_name, r_type, r_cuisine, r_rating, r_lat, r_lng in map_rests:
            db.session.add(MapRestaurant(
                name=r_name, type=r_type, cuisine=r_cuisine,
                rating=r_rating, latitude=r_lat, longitude=r_lng,
            ))

        db.session.commit()
        print("Database seeded successfully!")
