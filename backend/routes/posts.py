from flask import Blueprint, request, jsonify
from models import db, Post, Comment, User
from datetime import datetime, timezone

posts_bp = Blueprint('posts', __name__, url_prefix='/api/posts')


@posts_bp.route('', methods=['GET'])
def get_posts():
    """Get all posts
    ---
    tags:
      - Posts
    responses:
      200:
        description: List of all travel posts (newest first)
    """
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([p.to_dict() for p in posts]), 200


@posts_bp.route('', methods=['POST'])
def create_post():
    """Create a new post
    ---
    tags:
      - Posts
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            caption:
              type: string
              example: Beautiful sunset at the beach!
            location:
              type: string
              example: Goa, India
            image:
              type: string
              example: https://example.com/photo.jpg
    responses:
      201:
        description: Post created successfully
    """
    caption = request.form.get('caption', '') or (request.get_json() or {}).get('caption', '')
    location = request.form.get('location', '') or (request.get_json() or {}).get('location', '')
    image = request.form.get('image', '') or (request.get_json() or {}).get('image', '')

    if 'image' in request.files:
        image = 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800'

    if not image:
        image = 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800'

    user = User.query.first()

    post = Post(
        user_id=user.id if user else 1,
        post_image=image,
        caption=caption,
        location=location,
        created_at=datetime.now(timezone.utc),
    )
    db.session.add(post)
    db.session.commit()

    return jsonify({
        'message': 'Post created successfully',
        'post': post.to_dict(),
    }), 201


@posts_bp.route('/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    """Toggle like on a post
    ---
    tags:
      - Posts
    parameters:
      - name: post_id
        in: path
        type: integer
        required: true
        default: 1
    responses:
      200:
        description: Like toggled
      404:
        description: Post not found
    """
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    if post.is_liked:
        post.likes -= 1
        post.is_liked = False
    else:
        post.likes += 1
        post.is_liked = True

    db.session.commit()

    return jsonify({
        'message': 'Like toggled',
        'likes': post.likes,
        'isLiked': post.is_liked,
    }), 200


@posts_bp.route('/<int:post_id>/comment', methods=['POST'])
def comment_on_post(post_id):
    """Add a comment to a post
    ---
    tags:
      - Posts
    parameters:
      - name: post_id
        in: path
        type: integer
        required: true
        default: 1
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [comment]
          properties:
            comment:
              type: string
              example: Amazing photo! Love the colors.
    responses:
      201:
        description: Comment added
      404:
        description: Post not found
    """
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    data = request.get_json()
    comment_text = data.get('comment', '').strip()

    if not comment_text:
        return jsonify({'error': 'Comment text is required'}), 400

    user = User.query.first()

    comment = Comment(
        post_id=post.id,
        user_id=user.id if user else 1,
        text=comment_text,
    )
    db.session.add(comment)
    post.comments_count += 1
    db.session.commit()

    return jsonify({
        'message': 'Comment added',
        'comment': comment.to_dict(),
    }), 201
