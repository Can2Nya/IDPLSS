# coding: utf-8
from flask import jsonify, request, render_template
from application.main import main
from application.main.authentication import auth
from application.main.decorators import permission_required, admin_required
from application.models import Permission


@main.route('/index', methods=['GET'])
@auth.login_required
def index():
    """
    主页:返回主页需要的一些动态信息,包括视频信息,文本信息,学习方法等
    :return:response
    """
    response = jsonify({'status': 'index page datasource'})
    response.status_code = 200
    return response


@main.route('/api/test')
@auth.login_required
@permission_required(Permission.UPLOAD_VIDEO)
def test():
    return render_template('index.html')