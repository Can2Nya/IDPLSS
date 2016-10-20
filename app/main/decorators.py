# coding: utf-8
from functools import wraps
from flask import request, jsonify, g, make_response, abort, Response
from app.models import Permission, User


def permission_required(permissions):
    """
    装饰器,用来检查用户是否有权限访问某个API
    原理:通过flask request对象中封装的authorization来访问user_name,进而验证其权限
    :param permissions:
    :return:decorator function
    """
    from app.main.responses import not_found, forbidden

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_name = request.authorization.username
            user = User.query.filter_by(user_name=user_name).first()
            if user is None:
                user = User.query.filter_by(email=user_name).first()
                if user is None:
                    user = User.verify_auth_token(user_name)
            # TODO(ddragon)支持邮箱登录
            if user is None:
                return not_found()
            if not user.can(permissions) or user.confirmed is False:
                return forbidden("don't have permission or dose not confirm")
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def admin_required(f):
    """
    装饰器,用来检查用户是否为系统管理员
    :param f:
    :return:permission_required(administer)
    """
    return permission_required(Permission.ADMINISTER)(f)


def allow_cross_domain(f):
    """
    用来允许跨域访问的装饰器
    :param f:
    :return:
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        request_info = make_response(f(*args, **kwargs))
        request_info.headers['Access-Control-Allow-Origin'] = '*'
        request_info.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        allow_headers = "X-Requested-With, Content-Type, Accept"
        max_age = 1728000
        request_info.headers['Access-Control-Allow-Headers'] = allow_headers
        request_info.headers['Access-Control-Max-Age'] = max_age
        return request_info
    return decorated_function


def get_current_user(f):
    """
    用来获取当前用户的装饰器,支持三种方式验证,token验证,账号名密码登录验证,邮箱和密码登录验证
    :param f:
    :return:
    """
    from app.main.responses import not_found

    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if not auth:
            return not_found()
        current_user = User.verify_auth_token(auth.username)   # verify token user
        if current_user is None:
            current_user = User.query.filter_by(user_name=auth.username).first()
            auth_ok = False
            if current_user is not None:
                auth_ok = current_user.verify_password(auth.password)
            else:
                current_user = User.query.filter_by(email=auth.username).first()
                if current_user is not None:
                    auth_ok = current_user.verify_password(auth.password)
            if not auth_ok:
                return not_found()
        g.current_user = current_user
        return f(*args, **kwargs)
    return decorated_function


def user_login_info(f):
    """
    记录用户的行为日志,记录之前判断是否有登录,如有登录则当前登录的用户
    :param f:
    :return:如果已经登录返回当前登录用户,未登录返回None
    """
    from app.main.responses import not_found

    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if not auth:
            g.current_user = None
        else:
            current_user = User.verify_auth_token(auth.username)   # verify token user
            if current_user is None:
                current_user = User.query.filter_by(user_name=auth.username).first()
                auth_ok = False
                if current_user is not None:
                    auth_ok = current_user.verify_password(auth.password)
                else:
                    current_user = User.query.filter_by(email=auth.username).first()
                    if current_user is not None:
                        auth_ok = current_user.verify_password(auth.password)
                if not auth_ok:
                    return not_found()
            g.current_user = current_user
        return f(*args, **kwargs)
    return decorated_function






