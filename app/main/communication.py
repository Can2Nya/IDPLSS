# coding: utf-8
from flask import jsonify, request, current_app, url_for
from app.main import main
from app.main.authentication import auth
from app.utils.responses import self_response
from app.main.decorators import permission_required, allow_cross_domain, get_current_user
from app.models import db, User, Follow, Post, Role, PostComment


@main.route('/api/posts', methods=['GET', 'OPTIONS'])
@allow_cross_domain
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


@main.route('/api/posts/<int:pid>', methods=['GET', 'DELETE', 'OPTIONS'])
@allow_cross_domain
def post_detail(pid):
    if request.method == 'GET':
        post = Post.query.get_or_404(pid)
        return jsonify(post.to_json)
    if request.method == 'DELETE':
        post = Post.query.get_or_404(pid)
        post.show = False
        db.session.add(post)
        db.session.commit()
        return self_response('delete post successfully')
    else:
        return self_response('invalid operate')


@main.route('/api/posts/new_post', methods=['POST', 'OPTIONS'])
@allow_cross_domain
@auth.login_required
def new_post():
    post = Post.from_json(request.json)
    db.session.add(post)
    db.session.commit()
    return self_response('publish post successfully')


@main.route('/api/posts/<int:pid>/comments', methods=['POST', 'OPTIONS'])
@allow_cross_domain
def post_comments(pid):
    post = Post.query.get_or_404(pid)
    comments = post.comments.order_by(PostComment.timestamp)
    return jsonify({'comments': [comment.to_json() for comment in comments]})


@main.route('/api/posts/<int:pid>/new_comment', methods=['POST', 'OPTIONS'])
@auth.login_required
@allow_cross_domain
def new_comment(pid):
    post_comment = PostComment.from_json(request.json)
    db.session.add(post_comment)
    db.session.commit()
    return self_response('publish comment successfully')


@main.route('/api/posts/comment/<cid>', methods=['DELETE', 'OPTIONS'])
@auth.login_required
@allow_cross_domain
def delete_comment(cid):
    comment = PostComment.query.get_or_404(cid)
    comment.show = False
    db.session.add(comment)
    db.session.commit()
    return self_response('delete comment successfully')


@main.route('/api/posts/<int:pid>/collection-post', methods=['POST', 'DELETE', 'OPTIONS'])
@auth.login_required
@allow_cross_domain
@get_current_user
def collections_post(pid):
    user = g.current_user
    post = Post.query.get_or_404(pid)
    if request.method == 'POST':
        user.collect(post)
        return self_response('collect post successfully')
    if request.method == 'DELETE':
        user.uncollect(post)
        return self_response('uncollect post successfully')
    else:
        return self_response('invalid operate')





