# coding: utf-8
from flask import jsonify, request, current_app, url_for
from app.main import main
from app.main.authentication import auth
from app.utils.responses import make_response
from app.main.decorators import permission_required
from app.models import db, User, Follow, Post, Role


@main.route('/posts')
def posts():
    page = request.args.get('page', 1, type=int)
    pagination = Post.query.order_by(Post.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_posts = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.posts', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.posts', page=page+1, _external=True)
    return jsonify({
        'posts': [post.to_json() for post in all_posts],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })


@main.route('/posts/<int:pid>')
def post_detail(pid):
    post = Post.query.get_or_404(pid)
    return jsonify(post.to_json)


