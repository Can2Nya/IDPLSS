# coding: utf-8
from flask import jsonify, request, render_template, g, render_template
from app.main import main
from app.main.authentication import auth
from app.main.decorators import permission_required, admin_required, get_current_user
from app.models import Permission
from app.utils.responses import self_response
from app.main.responses import test_response
from app.utils.model_tools import have_school_permission
from app.recommend.code_start import code_start_course


@main.route('/', methods=['GET'])
def index():
    """
    主页:返回主页需要的一些动态信息,包括视频信息,文本信息,学习方法等
    :return:response
    """
    # print g.current_user.user_name
    pass


@main.route('/api/test', methods=['GET'])
def test():
    return test_response('test page info')


@main.route('/api/need-login', methods=['GET'])
@auth.login_required
def need_login():
    return test_response('need-login page')


@main.route('/api/permission')
@get_current_user
def have_permission():
    user = g.current_user
    if have_school_permission(user):
        print "user role is %s rid is %s" % (user.role, user.role_id)
        return jsonify({"status": "yes have"})
    else:
        print "user role is %s rid is %s" % (user.role, user.role_id)
        return jsonify({"status": "no does not have"})


@main.route('/api/user/test')
@get_current_user
def user_test():
    courses = code_start_course(g.current_user)
    for course in courses:
        print course[0].to_json()
    return self_response("ok")
