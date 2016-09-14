# coding: utf-8
from flask import jsonify, request, g, make_response
from app.main import main
from app.models import db, User, Follow, Role, Permission, Post, PostComment, CourseVideo, VideoComment, TextResource, TextResourceComment
from app.main.authentication import auth
from app.main.decorators import permission_required, get_current_user, allow_cross_domain
from app.utils.responses import self_response
from app.main.responses import bad_request, update_status


@main.route('/api/user/info', methods=['GET', 'PUT', 'OPTIONS'])
@auth.login_required
@get_current_user
@allow_cross_domain
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


@main.route('/api/user/zone/<int:uid>', methods=['GET', 'OPTIONS'])
@auth.login_required
@allow_cross_domain
def show_user(uid):
    user = User.query.get_or_404(uid)
    return jsonify(user.to_json())


@main.route('/api/user/is_following', methods=['POST', 'OPTIONS'])
@get_current_user
@auth.login_required
@allow_cross_domain
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


@main.route('/api/user/is_followed_by', methods=['POST', 'OPTIONS'])
@get_current_user
@auth.login_required
@allow_cross_domain
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


@main.route('/api/user/follow', methods=['POST', 'OPTIONS'])
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
@allow_cross_domain
def follow():
    info = request.json
    follow_id = info['follow_id']
    user = g.current_user
    follow_user = User.query.get_or_404(follow_id)
    if not user or not follow_user:
        return bad_request('the user does not exist')
    user.follow(follow_user)
    return self_response('follow successfully')


@main.route('/api/user/unfollow', methods=['POST', 'OPTIONS'])
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
@allow_cross_domain
def unfollow():
    info = request.json
    unfollow_id = info['unfollow_id']
    user = g.current_user
    follow_user = User.query.get_or_404(unfollow_id)
    if not user or not follow_user:
        return bad_request('the user does not exist')
    user.unfollow(follow_user)
    return self_response('unfollow successfully')


@main.route('/api/user/followers/<int:uid>', methods=['POST', 'OPTIONS'])
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
@allow_cross_domain
def followers(uid):
    user = User.query.get_or_404(uid)
    user_followers = user.followers.all()
    return jsonify({"followers": [follower.followers_to_json() for follower in user_followers]})


@main.route('/api/user/following/<int:uid>', methods=['GET', 'OPTIONS'])
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
@allow_cross_domain
def following(uid):
    user = User.query.get_or_404(uid)
    user_following = user.followings.all()
    return jsonify({"following": [followed.following_to_json() for followed in user_following]})


@main.route('/api/user/posts', methods=['GET', 'OPTIONS'])
@auth.login_required
@get_current_user
@allow_cross_domain
def user_posts():
    user = g.current_user
    posts = user.posts.all()
    return jsonify({"posts": [post.to_json() for post in posts]})


@main.route('/api/user/posts-comments', methods=['GET', 'OPTIONS'])
@auth.login_required
@allow_cross_domain
@get_current_user
def posts_comments():
    user = g.current_user
    post_comments = user.post_comments.all()
    return jsonify({"post_comments", [comment.to_json() for comment in post_comments]})


@main.route('/api/user/course-video', methods=['GET', 'OPTIONS'])
@auth.login_required
@get_current_user
@allow_cross_domain
def course_video():
    user = g.current_user
    all_video = user.course_video.all()
    return jsonify({"course_video": [video.to_json() for video in all_video]})


@main.route('/api/user/video-comments', methods=['GET', 'OPTIONS'])
@auth.login_required
@allow_cross_domain
@get_current_user
def video_comments():
    user = g.current_user
    comments = user.video_comments.all()
    return jsonify({"video_comments", [comment.to_json() for comment in comments]})


@main.route('/api/user/text-resources', methods=['GET', 'OPTIONS'])
@auth.login_required
@allow_cross_domain
@get_current_user
def text_resources():
    user = g.current_user
    resources = user.text_resource.all()
    return jsonify({'text_resources', [text_resource.to_json() for text_resource in resources]})


@main.route('/api/user/text-resource-comments', methods=['GET', 'OPTIONS'])
@auth.login_required
@allow_cross_domain
@get_current_user
def text_resource_comments():
    user = g.current_user
    resource_comments = user.text_resource_comments.all()
    return jsonify({"text_resource_comments", [comment.to_json() for comment in resource_comments]})