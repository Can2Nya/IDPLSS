# coding: utf-8
from flask import jsonify, request, current_app, url_for, g
from app.main import main
from app.main.responses import not_found
from app.main.authentication import auth
from app.utils.responses import self_response
from app.main.decorators import permission_required, get_current_user
from app.models import db, User, Follow, Post, Role, PostComment, Permission
from app.utils.model_tools import calc_count


@main.route('/api/posts', methods=['GET'])
def posts():
    page = request.args.get('page', 1, type=int)
    pagination = Post.query.filter_by(show=True).order_by(Post.timestamp.desc()).paginate(
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


@main.route('/api/posts/category/<int:cate_id>', methods=['GET'])
def posts_category(cate_id):
    page = request.args.get('page', 1, type=int)
    pagination = Post.query.filter_by(post_category=cate_id, show=True).order_by(Post.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_posts = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.posts_category', page=page-1, cate_id=cate_id, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.posts_category', page=page+1, cate_id=cate_id, _external=True)
    return jsonify({
        'posts': [post.to_json() for post in all_posts],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })


@main.route('/api/posts/<int:pid>', methods=['GET', 'DELETE'])
def post_detail(pid):
    if request.method == 'GET':
        post = Post.query.get_or_404(pid)
        if post.show is not False:
            post.page_view += 1
            db.session.add(post)
            db.session.commit()
            return jsonify(post.to_json())
        else:
            return not_found()
    if request.method == 'DELETE':
        post = Post.query.get_or_404(pid)
        post.show = False
        db.session.add(post)
        db.session.commit()
        return self_response('delete post successfully')
    else:
        return self_response('invalid operation')


@main.route('/api/posts/new-post', methods=['POST'])
@auth.login_required
@permission_required(Permission.WRITE_ARTICLE)
def new_post():
    post = Post.from_json(request.json)
    db.session.add(post)
    db.session.commit()
    return self_response('publish post successfully')


@main.route('/api/posts/<int:pid>/comments', methods=['GET'])
def post_comments(pid):
    page = request.args.get('page', 1, type=int)
    pagination = PostComment.query.filter_by(post_id=pid, show=True).order_by(PostComment.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_COMMENTS_PER_PAGE"],
        error_out=False
    )
    all_comments = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.post_comments', pid=pid, page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.post_comments', pid=pid, page=page+1, _external=True)
    return jsonify({
        'posts': [comment.to_json() for comment in all_comments],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })


@main.route('/api/posts/<int:pid>/new-comment', methods=['POST'])
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def new_comment(pid):
    post_comment = PostComment.from_json(request.json)
    db.session.add(post_comment)
    db.session.commit()
    return self_response('publish comment successfully')


@main.route('/api/posts/comment/<cid>', methods=['DELETE'])
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def delete_comment(cid):
    comment = PostComment.query.get_or_404(cid)
    comment.show = False
    db.session.add(comment)
    db.session.commit()
    return self_response('delete comment successfully')


@main.route('/api/posts/<int:pid>/collect-post', methods=['GET', 'DELETE'])
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def collections_post(pid):
    user = g.current_user
    post = Post.query.get_or_404(pid)
    if request.method == 'GET':
        user.collect_post(post)
        return self_response('collect post successfully')
    if request.method == 'DELETE':
        user.uncollect_post(post)
        return self_response('unfavorite post successfully')
    else:
        return self_response('invalid operation')


@main.route('/api/posts/<int:pid>/is-collecting', methods=['GET'])
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def is_collecting(pid):
    user = g.current_user
    post = Post.query.get_or_404(pid)
    if post in user.collection_posts:
        return self_response("True")
    else:
        return self_response("False")


@main.route('/api/posts/search', methods=['POST'])
def search_post():
    search_info = request.json
    key_word = search_info['key_words']
    page = request.args.get('page', 1, type=int)
    pagination = Post.query.filter(Post.title.like('%'+key_word+'%'), Post.show == True).paginate(
        page, per_page=current_app.config['IDPLSS_POSTS_PER_PAGE'],
        error_out=False
    )
    all_posts = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.search_post', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.search_post', page=page+1, _external=True)
    return jsonify({
        'search_result': [post.to_json() for post in all_posts],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })




