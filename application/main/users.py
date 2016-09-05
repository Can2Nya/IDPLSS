# coding: utf-8
from flask import jsonify, request
from application.main import main
from application.models import User, Follow, Role, Permission
from application.main.authentication import auth
from application.main.decorators import permission_required
from application.utils.responses import make_response
from application.main.errors import bad_request


@main.route('/api/user/info/<int:uid>')
@auth.login_required
def user_info(uid):
    user = User.query.get_or_404(uid)
    if user is None:
        return make_response('user does not exist')
    else:
        return user.to_json()


@main.route('/api/user/is_following', methods=['POST'])
@auth.login_required
def is_following():
    """
    判断用户是否已经关注另一个用户
    如果已经关注,返回True,否则返回False
    :return:
    """
    info = request.json
    user_id = info['user_id']
    search_user_id = info['search_user_id']
    user = User.query.get_or_404(user_id)
    search_user = User.query.get_or_404(search_user_id)
    if not user or not search_user:
        return bad_request('the user does not exist')
    if user.is_following(search_user):
        return make_response(True)
    else:
        return make_response(False)
    # TODO(Dddragon): 判断关注与被关注逻辑是不是有问题


@main.route('/api/user/is_followed_by', methods=['POST'])
@auth.login_required
def is_followed_by():
    """
    判断一个用户是否为另一个用户的粉丝
    如果是返回True,否则返回False
    :return:
    """
    info = request.json
    user_id = info['user_id']
    search_user_id = info['search_user_id']
    user = User.query.get_or_404(user_id)
    search_user = User.query.get_or_404(search_user_id)
    if not user or not search_user:
        return bad_request('the user does not exist')
    if user.is_followed_by(search_user):
        return make_response(True)
    else:
        return make_response(False)


@main.route('/api/user/follow', methods=['POST'])
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def follow():
    info = request.json
    user_id = info['user_id']
    follow_id = info['follow_id']
    user = User.query.get_or_404(user_id)
    follow_user = User.query.get_or_404(follow_id)
    if not user or not follow_user:
        return bad_request('the user does not exist')
    user.follow(follow_user)
    return make_response('follow successful')


@main.route('/api/user/unfollow', methods=['POST'])
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def unfollow():
    info = request.json
    user_id = info['user_id']
    unfollow_id = info['unfollow_id']
    user = User.query.get_or_404(user_id)
    follow_user = User.query.get_or_404(unfollow_id)
    if not user or not follow_user:
        return bad_request('the user does not exist')
    user.unfollow(follow_user)
    return make_response('unfollow successful')

