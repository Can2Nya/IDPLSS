# coding: utf-8
from functools import wraps
from flask import request, jsonify, g
from app.models import Permission, User
from errors import not_found, forbidden
from manage import app


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