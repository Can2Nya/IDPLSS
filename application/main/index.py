# coding: utf-8
from flask import jsonify, request, render_template
from application.main import main
from application.main.authentication import auth
from application.main.decorators import permission_required, admin_required
from application.models import Permission
from application.utils.responses import make_response


@main.route('/index', methods=['GET'])
@auth.login_required
def index():
    """
    主页:返回主页需要的一些动态信息,包括视频信息,文本信息,学习方法等
    :return:response
    """
    return make_response('index page datasource')


@main.route('/api/test')
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def test():
    return make_response('the test page')