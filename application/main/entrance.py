# coding: utf-8
from flask import jsonify, request
from authentication import auth
from errors import unauthorized, bad_request
from application.main import main
from application.models import User, Role
from application import db
from application.utils.mail import send_email
from application.utils.responses import make_response


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
    return make_response('register successful')
    # TODO(Ddragon):完善用户注册成功时候的返回信息

