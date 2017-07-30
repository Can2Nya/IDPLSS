# -*- coding: utf-8 -*-
"""
    main.decorators
    ~~~~~~~~~~~~

    定义用户权限管理,用户登录(登录异常)处理的装饰器

"""

from functools import wraps

from flask import request, g, make_response

from ..models import Permission, User


def permission_required(permissions):
    """
    装饰器,用来检查用户是否有权限访问某个API
    从g对象获取current 依赖装饰器admin_required
    原理:通过flask request对象中封装的authorization来访问user_name,进而验证其权限
    :param permissions:
    :return:decorator function
    """
    from app.main.responses import forbidden

    def decorator_function(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user = g.current_user  # 从g对象获取已登录用户信息
            if not current_user.can(permissions):
                return forbidden("your account does not have access permissions")
            return f(*args, **kwargs)
        return decorated_function
    return decorator_function


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


def login_required(f):
    """
    用户登录访问装饰器
    支持三种方式验证,token验证,账号名密码登录验证,邮箱和密码登录验证
    并且保存获取当前登录的用户
    :param f:
    :return:
    """
    from app.main.responses import not_found, forbidden, bad_request

    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if not auth:
            return not_found()  # 拦截authorization信息错误
        current_user = User.verify_auth_token(auth.username)
        if not current_user:
            user_by_name = User.query.filter_by(user_name=auth.username).first()
            user_by_email = User.query.filter_by(email=auth.username).first()
            current_user = user_by_name if user_by_name else user_by_email
            if not current_user:
                return not_found()  # 拦截用户信息错误
            auth_ok = current_user.verify_password(auth.password)
            if not auth_ok:
                return bad_request('password incorrect')   # 拦截密码错误
        if current_user.is_ban or not current_user.confirmed:
            return forbidden('your account has been banned')  # 拦截账号禁用或未激活
        g.current_user = current_user
        return f(*args, **kwargs)
    return decorated_function


def user_login_info(f):
    """
    记录用户信息,如果已经登录保存到g.current_user
    :param f:
    :return:如果已经登录返回当前登录用户,未登录返回None
    """
    from app.main.responses import  forbidden

    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if not auth:
            current_user = None
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
                    current_user = None
            if current_user is not None and current_user.is_ban is True and current_user.confirmed:
                return forbidden('user has been banned')  # 用户被禁止访问post方法,不能进行post操作
        g.current_user = current_user
        return f(*args, **kwargs)
    return decorated_function


def manage_permission_required(f):
    """
    token验证,账号名密码登录验证,邮箱和密码登录验证,判断用户是否有权限进行角色分配,校级管理员,管理员有权限,其它一律拦截
    :param f:
    :return:
    """
    from app.models import Role
    from app.main.responses import  forbidden

    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = g.current_user
        admin = Role.query.filter_by(role_name='Admin').first()
        school_admin = Role.query.filter_by(role_name='SchoolAdmin').first()
        if not (current_user.role == admin or current_user.role == school_admin):
            return forbidden('does not have permission to access ')  # 拦截权限不够
        g.current_user = current_user
        return f(*args, **kwargs)
    return decorated_function







