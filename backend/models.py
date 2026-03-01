from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(120), default='')
    bio = db.Column(db.Text, default='')
    profile_image = db.Column(db.String(500), default='')
    followers = db.Column(db.Integer, default=0)
    following = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    posts = db.relationship('Post', backref='author', lazy=True)
    saved_plans = db.relationship('SavedPlan', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'bio': self.bio,
            'profileImage': self.profile_image,
            'followers': self.followers,
            'following': self.following,
        }


class State(db.Model):
    __tablename__ = 'states'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(500), default='')
    culture = db.Column(db.Text, default='')
    festivals = db.Column(db.String(300), default='')
    famous_places = db.Column(db.String(300), default='')
    budget = db.Column(db.String(200), default='')
    best_time = db.Column(db.String(200), default='')
    latitude = db.Column(db.Float, default=0.0)
    longitude = db.Column(db.Float, default=0.0)

    tourist_attractions = db.relationship('TouristAttraction', backref='state', lazy=True)
    restaurants = db.relationship('StateRestaurant', backref='state', lazy=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'image': self.image,
            'culture': self.culture,
            'festivals': self.festivals,
            'famousPlaces': self.famous_places,
            'budget': self.budget,
            'bestTime': self.best_time,
            'coordinates': {
                'latitude': self.latitude,
                'longitude': self.longitude,
            },
            'touristAttractions': [a.to_dict() for a in self.tourist_attractions],
            'restaurants': [r.to_dict() for r in self.restaurants],
        }

    def to_summary_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'image': self.image,
            'culture': self.culture,
            'festivals': self.festivals,
            'famousPlaces': self.famous_places,
        }


class TouristAttraction(db.Model):
    __tablename__ = 'tourist_attractions'

    id = db.Column(db.Integer, primary_key=True)
    state_id = db.Column(db.Integer, db.ForeignKey('states.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default='')

    def to_dict(self):
        return {
            'name': self.name,
            'description': self.description,
        }


class StateRestaurant(db.Model):
    __tablename__ = 'state_restaurants'

    id = db.Column(db.Integer, primary_key=True)
    state_id = db.Column(db.Integer, db.ForeignKey('states.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    cuisine = db.Column(db.String(100), default='')
    rating = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'name': self.name,
            'cuisine': self.cuisine,
            'rating': self.rating,
        }


class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_image = db.Column(db.String(500), default='')
    caption = db.Column(db.Text, default='')
    location = db.Column(db.String(200), default='')
    likes = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    is_liked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    comments = db.relationship('Comment', backref='post', lazy=True)

    def to_dict(self):
        user = User.query.get(self.user_id)
        time_diff = datetime.now(timezone.utc) - self.created_at.replace(tzinfo=timezone.utc)
        hours = int(time_diff.total_seconds() / 3600)
        if hours < 1:
            timestamp = f"{int(time_diff.total_seconds() / 60)} minutes ago"
        elif hours < 24:
            timestamp = f"{hours} hours ago"
        else:
            timestamp = f"{hours // 24} days ago"

        return {
            'id': str(self.id),
            'username': user.username if user else 'unknown',
            'userImage': user.profile_image if user else '',
            'postImage': self.post_image,
            'caption': self.caption,
            'location': self.location,
            'likes': self.likes,
            'comments': self.comments_count,
            'timestamp': timestamp,
            'isLiked': self.is_liked,
        }


class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        user = User.query.get(self.user_id)
        return {
            'id': str(self.id),
            'username': user.username if user else 'unknown',
            'text': self.text,
            'timestamp': self.created_at.isoformat(),
        }


class SavedPlan(db.Model):
    __tablename__ = 'saved_plans'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    destination = db.Column(db.String(200), nullable=False)
    duration = db.Column(db.String(50), default='')
    budget = db.Column(db.String(50), default='')

    def to_dict(self):
        return {
            'id': str(self.id),
            'destination': self.destination,
            'duration': self.duration,
            'budget': self.budget,
        }


class TouristSpot(db.Model):
    __tablename__ = 'tourist_spots'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), default='monument')
    description = db.Column(db.Text, default='')
    latitude = db.Column(db.Float, default=0.0)
    longitude = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'type': self.type,
            'coordinates': {
                'latitude': self.latitude,
                'longitude': self.longitude,
            },
            'description': self.description,
        }


class MapRestaurant(db.Model):
    __tablename__ = 'map_restaurants'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), default='restaurant')
    cuisine = db.Column(db.String(100), default='')
    rating = db.Column(db.Float, default=0.0)
    latitude = db.Column(db.Float, default=0.0)
    longitude = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'type': self.type,
            'coordinates': {
                'latitude': self.latitude,
                'longitude': self.longitude,
            },
            'cuisine': self.cuisine,
            'rating': self.rating,
        }
