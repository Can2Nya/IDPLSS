# coding: utf-8
from flask import jsonify, request, render_template, g
from app.main import main
from app.main.authentication import auth
from app.main.decorators import permission_required, admin_required, allow_cross_domain, get_current_user
from app.models import Permission
from app.utils.responses import self_response


@main.route('/index', methods=['GET'])
@allow_cross_domain
@auth.login_required
@get_current_user
def index():
    """
    主页:返回主页需要的一些动态信息,包括视频信息,文本信息,学习方法等
    :return:response
    """

    return self_response('index page info')


@main.route('/api/test')
@auth.login_required
@allow_cross_domain
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def test():
    return self_response('test page info')
