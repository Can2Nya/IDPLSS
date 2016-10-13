# coding: utf-8
from flask import jsonify, request, render_template, g, render_template
from app.main import main
from app.main.authentication import auth
from app.main.decorators import permission_required, admin_required, get_current_user
from app.models import Permission
from app.utils.responses import self_response
from app.main.responses import test_response


@main.route('/', methods=['GET'])
def index():
    """
    主页:返回主页需要的一些动态信息,包括视频信息,文本信息,学习方法等
    :return:response
    """
    # print g.current_user.user_name
    return render_template('index.html')

@main.route('/api/test', methods=['GET'])
def test():
    return test_response('test page info')


@main.route('/api/need-login', methods=['GET'])
@auth.login_required
def need_login():
    return test_response('need-login page')
