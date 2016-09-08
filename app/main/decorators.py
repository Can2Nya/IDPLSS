# coding: utf-8
from functools import wraps
from flask import request, jsonify, g, make_response, abort
from app.models import Permission, User
from responses import not_found, forbidden
from app.main.responses import info_not_found


def permission_required(permissions):
    """
    装饰器,用来检查用户是否有权限访问某个API
    原理:通过flask request对象中封装的authorization来访问user_name
    :param permissions:
    :return:decorator function
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_name = request.authorization.username
            user = User.query.filter_by(user_name=user_name).first()
            if user is None:
                return not_found("user don't exist")
            print user.role.permissions
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
        request_info.headers['Access-Control_Allow-Origin'] = '*'
        request_info.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE'
        allow_headers = "Referer, Accept, Origin, User_Agent"
        request_info.headers['Access-Control-Allow-Headers'] = allow_headers
        return request_info
    return decorated_function


def get_current_user(f):
    """
    用来获取当前用户的装饰器,支持三种方式验证,token验证,账号名密码登录验证,邮箱和密码登录验证
    :param f:
    :return:
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if not auth:
            return info_not_found
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
                return info_not_found
        g.current_user = current_user
        return f(*args, **kwargs)
    return decorated_function



