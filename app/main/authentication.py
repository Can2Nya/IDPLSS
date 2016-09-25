# coding: utf-8
from flask_httpauth import HTTPBasicAuth
from flask import jsonify, request, g, current_app, abort, flash
from qiniu import Auth, put_file, etag, urlsafe_base64_encode
from app.models import db, User, Permission, Serializer
from app.main.responses import forbidden, unauthorized, bad_request
from app.main import main
from app.main.decorators import get_current_user, allow_cross_domain
auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username_or_email_or_token, password):
    """
    httpAuth的回调函数,用来验证用户名和密码是否正确
    :param username_or_email_or_token:
    :param password:
    :return:boolean
    """
    if password == '':
        print ''
        user = User.verify_auth_token(username_or_email_or_token)
        return user is not None
    user = User.query.filter_by(user_name=username_or_email_or_token).first()
    if user is None:
        user = User.query.filter_by(email=username_or_email_or_token).first()
    if not user:
        return False
    return user.verify_password(password)


@auth.error_handler
@allow_cross_domain
def auth_error():
    """
    捕获未授权验证的错误
    :return: unauthorized 401
    """
    return unauthorized('Invalid credentidls from auth error handler')
    # TODO(Ddragon):修改unauthorized的错误描述


@main.route('/api/user/is-confirm', methods=['POST', 'OPTIONS'])
def is_confirmed():
    """
    检测注册用户是否已经通过token激活,激活才能正常使用服务
    :return: json
    """
    info = request.json
    user_id = info['user_id']
    user = User.query.get_or_404(user_id)
    if user is None:
        return bad_request('user does not exist')
    else:
        return jsonify({'status': user.confirmed})


@main.route('/api/user/token', methods=['GET', 'OPTIONS'])
@get_current_user
@auth.login_required
def get_token():
    """
    用来获取用户临时的token,使用token来进行账号信息验证
    :return:token
    """
    user = g.current_user
    print user.user_name
    return jsonify({'token': user.generate_auth_token(
        expiration=3600), 'expiration': 3600})


@main.route('/api/user/confirm/<token>', methods=['GET', 'OPTIONS'])
def confirm(token):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except:
        abort(404)
    user_id = data['confirm']
    user = User.query.get_or_404(user_id)
    if user is None:
        return forbidden('incorrect user')
    else:
        user.confirmed = True
        db.session.add(user)
        db.session.commit()
        return jsonify({'status': 'confirm successful'})


@main.route('/api/user/qiniu-token', methods=['GET', 'OPTIONS'])
@auth.login_required
def get_qiniu_token():
    """
    用来获取七牛云存储的上传token
    :return:mobile_upload_token
    """
    q = Auth(current_app.config['QINIU_ACCESS_KEY'], current_app.config['QINIU_SECRET_KEY'])
    bucket_name = 'idplss'
    policy = {
        "scope": 'idplss'
    }
    key = None
    mobile_upload_token = q.upload_token(bucket_name, key, 3600, policy)
    return jsonify({'uptoken': mobile_upload_token})



