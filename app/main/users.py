# coding: utf-8
from flask import jsonify, request, g, make_response, current_app, url_for
from app.main import main
from app.models import db, User, Follow, Role, Permission, Post, PostComment, Course, CourseComment,\
    TextResource, TextResourceComment
from app.main.authentication import auth
from app.main.decorators import permission_required, get_current_user
from app.utils.responses import self_response
from app.main.responses import bad_request, update_status
from app.utils.mail import send_email
from app.utils.pagination import QueryPagination


@main.route('/api/user/register', methods=['POST'])
def register():
    """
    功能:用户注册,注册成功发送激活邮件
    :return: 注册失败时,返回bad_request,400,并提示相应的信息
             注册成功时,返回json,并提示相应的信息
    """
    reg_info = request.json
    user_name = reg_info['user_name']
    user_email = reg_info['user_email']
    pass_word = reg_info['user_password']
    if not user_name or not user_email or not pass_word:
        return bad_request('user_name or user_email or password cat not be empty')
    user = User.query.filter_by(user_name=user_name).first()
    if user is not None:
        return bad_request('user_name can not be repeated')
    user = User.query.filter_by(email=user_email).first()
    if user is not None:
        return bad_request('email can not be repeated')
    u = User(user_name=user_name, email=user_email, pass_word=pass_word)
    db.session.add(u)
    db.session.commit()
    token = u.generate_confirm_token()
    send_email(u.email, '激活你的账号', 'confirm_info/confirm', User=u, token=token)
    return self_response('register successful')
    # TODO(Ddragon):完善用户注册成功时候的返回信息


@main.route('/api/user/info', methods=['GET', 'PUT'])
@auth.login_required
@get_current_user
def user_info():
    if request.method == 'GET':
        user = g.current_user
        if user is None:
            return self_response('user does not exist')
        else:
            return make_response(jsonify(user.to_json()))
    elif request.method == 'PUT':
        user = User.from_json(g.current_user, request.json)
        db.session.add(user)
        db.session.commit()
        return update_status('update user information successfully')
    else:
        return self_response('incorrect method')


@main.route('/api/user/zone/<int:uid>', methods=['GET'])
@auth.login_required
def show_user(uid):
    user = User.query.get_or_404(uid)
    return jsonify(user.to_json())


@main.route('/api/user/is_following', methods=['POST'])
@get_current_user
@auth.login_required
def is_following():
    """
    判断用户是否已经关注另一个用户
    如果已经关注,返回True,否则返回False
    :return:
    """
    info = request.json
    search_user_id = info['search_user_id']
    user = g.current_user
    search_user = User.query.get_or_404(search_user_id)
    if user.is_following(search_user):
        return self_response(True)
    else:
        return self_response(False)
    # TODO(Dddragon): 判断关注与被关注逻辑是不是有问题


@main.route('/api/user/is_followed_by', methods=['POST'])
@get_current_user
@auth.login_required
def is_followed_by():
    """
    判断一个用户是否为另一个用户的粉丝
    如果是返回True,否则返回False
    :return:
    """
    info = request.json
    search_user_id = info['search_user_id']
    user = g.current_user
    search_user = User.query.get_or_404(search_user_id)
    if user.is_followed_by(search_user):
        return self_response(True)
    else:
        return self_response(False)


@main.route('/api/user/follow', methods=['POST'])
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def follow():
    info = request.json
    follow_id = info['follow_id']
    user = g.current_user
    follow_user = User.query.get_or_404(follow_id)
    if not user or not follow_user:
        return bad_request('the user does not exist')
    user.follow(follow_user)
    return self_response('follow successfully')


@main.route('/api/user/unfollow', methods=['POST'])
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def unfollow():
    info = request.json
    unfollow_id = info['unfollow_id']
    user = g.current_user
    follow_user = User.query.get_or_404(unfollow_id)
    if not user or not follow_user:
        return bad_request('the user does not exist')
    user.unfollow(follow_user)
    return self_response('unfollow successfully')


@main.route('/api/user/followers/<int:uid>', methods=['POST'])
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def followers(uid):
    user = User.query.get_or_404(uid)
    user_followers = user.followers.all()
    return jsonify({"followers": [follower.followers_to_json() for follower in user_followers]})


@main.route('/api/user/following/<int:uid>', methods=['GET'])
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def following(uid):
    user = User.query.get_or_404(uid)
    user_following = user.followings.all()
    return jsonify({"following": [followed.following_to_json() for followed in user_following]})


@main.route('/api/user/posts', methods=['GET'])
@auth.login_required
@get_current_user
def user_posts():
    user = g.current_user
    page = request.args.get('page', 1, type=int)
    pagination = Post.query.filter_by(author_id=user.id).order_by(Post.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_posts = pagination.items
    count = 0
    for post in all_posts:
        if post.show is not False:
            count = count+1
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.user_posts', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.user_posts', page=page+1, _external=True)
    return jsonify({
        'posts': [post.to_json() for post in all_posts if post.show is not False],
        'prev': url_prev,
        'next': url_next,
        'count': count
    })


@main.route('/api/user/collection-posts', methods=['GET'])
@auth.login_required
@get_current_user
def user_collection_posts():
    user = g.current_user
    page = request.args.get('page', 1, type=int)
    posts = user.collection_posts
    count = 0
    sum = 0
    for post in posts:
        if post.show is not False:
            sum = sum+1
        count = count + 1
    new_list = QueryPagination(posts, page, count)
    slice_posts = new_list.query_pagination()
    next_url = None
    if new_list.has_next_page():
        next_url = url_for('main.user_collection_posts', page=page+1, _external=True)
    prev_url = None
    if new_list.has_prev_page():
        prev_url = url_for('main.user_collection_posts', page=page-1, _external=True)
    return jsonify({
        "collection_posts": [post.to_json() for post in slice_posts if post.show is not False],
        "next": next_url,
        "prev": prev_url,
        "count": sum
    })


@main.route('/api/user/posts-comments', methods=['GET'])
@auth.login_required
@get_current_user
def user_posts_comments():
    user = g.current_user
    page = request.args.get('page', 1, type=int)
    pagination = PostComment.query.filter_by(author_id=user.id).order_by(PostComment.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_comments = pagination.items
    count = 0
    for comment in all_comments:
        if comment.show is not False:
            count = count+1
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.user_posts_comments', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.user_posts_comments', page=page+1, _external=True)
    return jsonify({
        'posts': [comment.to_json() for comment in all_comments if comment.show is not False],
        'prev': url_prev,
        'next': url_next,
        'count': count
    })


@main.route('/api/user/courses', methods=['GET'])
@auth.login_required
@get_current_user
def user_courses():
    user = g.current_user
    page = request.args.get('page', 1, type=int)
    pagination = Course.query.filter_by(author_id=user.id).order_by(Course.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_courses = pagination.items
    count = 0
    for course in all_courses:
        if course.show is not False:
            count = count+1
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.user_courses', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.user_courses', page=page+1, _external=True)
    return jsonify({
        'courses': [course.to_json() for course in all_courses if course.show is not False],
        'prev': url_prev,
        'next': url_next,
        'count': count
    })


@main.route('/api/user/course-comments', methods=['GET'])
@auth.login_required
@get_current_user
def user_course_comments():
    user = g.current_user
    page = request.args.get('page', 1, type=int)
    pagination = CourseComment.query.filter_by(author_id=user.id).order_by(CourseComment.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_COMMENTS_PER_PAGE"],
        error_out=False
    )
    all_comments = pagination.items
    count = 0
    for comment in all_comments:
        if comment.show is not False:
            count = count+1
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.user_course_comments', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.user_course_comments', page=page+1, _external=True)
    return jsonify({
        'course_comments': [comment.to_json() for comment in all_comments if comment.show is not False],
        'prev': url_prev,
        'next': url_next,
        'count': count
    })


@main.route('/api/user/collection-courses', methods=['GET'])
@auth.login_required
@get_current_user
def user_collection_courses():
    user = g.current_user
    page = request.args.get('page', 1, type=int)
    all_courses = user.collection_courses
    count = 0
    sum_course = 0
    for course in all_courses:
        if course.show is not False:
            sum_course = sum_course +1
        count = count + 1
    new_list = QueryPagination(all_courses, page, count)
    slice_courses = new_list.query_pagination()
    next_url = None
    if new_list.has_next_page():
        next_url = url_for('main.user_collection_courses', page=page+1, _external=True)
    prev_url = None
    if new_list.has_prev_page():
        prev_url = url_for('main.user_collection_courses', page=page-1, _external=True)
    return jsonify({
        "collection_courses": [course.to_json() for course in slice_courses if course.show is not False],
        "next": next_url,
        "prev": prev_url,
        "count": sum_course
    })


@main.route('/api/user/text-resources', methods=['GET'])
@auth.login_required
@get_current_user
def user_text_resources():
    user = g.current_user
    page = request.args.get('page', 1, type=int)
    pagination = TextResource.query.filter_by(author_id=user.id).order_by(TextResource.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_text_resources = pagination.items
    count = 0
    for t_resource in all_text_resources:
        if t_resource.show is not False:
            count = count+1
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.user_text_resources', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.user_text_resources', page=page+1, _external=True)
    return jsonify({
        'text_resources': [t_resource.to_json() for t_resource in all_text_resources if t_resource.show is not False],
        'prev': url_prev,
        'next': url_next,
        'count': count
    })


@main.route('/api/user/text-resource-comments', methods=['GET'])
@auth.login_required
@get_current_user
def user_text_resource_comments():
    user = g.current_user
    page = request.args.get('page', 1, type=int)
    pagination = TextResourceComment.query.filter_by(author_id=user.id).order_by(TextResourceComment.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_COMMENTS_PER_PAGE"],
        error_out=False
    )
    all_comments = pagination.items
    count = 0
    for comment in all_comments:
        if comment.show is not False:
            count = count+1
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.user_text_resource_comments', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.user_text_resource_comments', page=page+1, _external=True)
    return jsonify({
        'video_comments': [comment.to_json() for comment in all_comments if comment.show is not False],
        'prev': url_prev,
        'next': url_next,
        'count': count
    })


@main.route('/api/user/collection-text-resources')
@auth.login_required
@get_current_user
def user_collection_text_resources():
    user = g.current_user
    page = request.args.get('page', 1, type=int)
    all_text_resources = user.collection_text_resource
    count = 0
    sum = 0
    for t_resource in all_text_resources:
        if t_resource.show is not False:
            sum = sum +1
        count = count + 1
    new_list = QueryPagination(all_text_resources, page, count)
    slice_t_resources = new_list.query_pagination()
    next_url = None
    if new_list.has_next_page():
        next_url = url_for('main.user_collection_text_resources', page=page+1, _external=True)
    prev_url = None
    if new_list.has_prev_page():
        prev_url = url_for('main.user_collection_text_resources', page=page-1, _external=True)
    return jsonify({
        "collection_text_resources": [t_resource.to_json() for t_resource in slice_t_resources if t_resource.show is not False],
        "next": next_url,
        "prev": prev_url,
        "count": sum
    })