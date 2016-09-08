# coding: utf-8
from flask import jsonify, request, g
from app.main import main
from app.models import db, User, Follow, Role, Permission
from app.main.authentication import auth
from app.main.decorators import permission_required, get_current_user
from app.utils.responses import self_response
from app.main.responses import bad_request, update_status


@main.route('/api/user/info', methods=['GET', 'PUT'])
@auth.login_required
@get_current_user
def user_info():
    if request.method == 'GET':
        user = g.current_user
        if user is None:
            return self_response('user does not exist')
        else:
            return jsonify(user.to_json())
    elif request.method == 'PUT':
        user = User.from_json(g.current_user, request.json)
        db.session.add(user)
        db.session.commit()
        return update_status('update user information successfully')
    else:
        return self_response('incorrect method')


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


@main.route('/api/user/followers')
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def followers():
    user = g.current_user
    user_followers = user.followers.all()
    return jsonify({"followers": [follower.followers_to_json() for follower in user_followers]})


@main.route('/api/user/following')
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def following():
    user = g.current_user
    user_following = user.followings.all()
    return jsonify({"following": [followed.following_to_json() for followed in user_following]})


@main.route('/api/user/posts')
@auth.login_required
@get_current_user
def user_posts():
    user = g.current_user
    user_posts = user.posts.all()


@main.route('/api/user/comments')
@auth.login_required
def user_comments():
    user = g.current_user
    user_comments = user.comments.all()

