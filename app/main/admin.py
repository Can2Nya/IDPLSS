# -*- coding:utf-8 -*-
import time

from flask import jsonify, current_app, request, url_for, g

from .. import db
from . import main
from ..models import User
from ..utils import logger, self_response
from .responses import bad_request, forbidden
from .decorators import manage_permission_required, login_required


@main.route('/api/control/show-users')
@login_required
@manage_permission_required
def all_user():
    user = g.current_user
    logger.info('manager {0} query users info at {1}'.format(user.user_name, time.strftime("%Y-%m-%d %H:%M:%S")))
    emails = set()  # 过滤当前登录用户和管理员的信息
    emails.add(user.email)
    emails.add(current_app.config['IDPLSS_ADMIN'])
    page = request.args.get('page', 1, type=int)
    pagination = User.query.filter_by(is_ban=False).order_by(
        User.member_since.desc()).paginate(
        page, error_out=False, per_page=current_app.config['IDPLSS_COMMON_COUNT']
    )
    all_users = pagination.items
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.all_user', page=page-1, _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.all_user', page=page+1, _external=True)
    return jsonify({
        "users": [u.to_json() for u in all_users if u.email not in emails],
        "prev_url": prev_url,
        "next_url": next_url,
        "count": pagination.total-len(emails)
    })


@main.route('/api/control/manage', methods=['POST'])
@login_required
@manage_permission_required
def set_user_role():
    req_info = request.json
    uid = req_info['uid']
    role_id = req_info['role_id']
    u = User.query.filter_by(id=uid).first()
    if not u:
        return bad_request('user info incorrect')
    admin = g.current_user
    if admin.role_id == 1 and (role_id == 2 or role_id == 3 or role_id ==4):  # 管理员有设置校级管理员和教师、学生的权限
        u.role_id = role_id
        db.session.add(u)
        db.session.commit()
        logger.info("manager {0} set user {1} role_id {2} ".format(admin.user_name, u.user_name, role_id))
        return self_response('change user role successfully')  # 校级管理员有设置教师的权限
    elif admin.role_id == 2 and (role_id == 3 or role_id ==4):
        u.role_id = role_id
        db.session.add(u)
        db.session.commit()
        logger.info("manager {0} set user {1} role_id {2} ".format(admin.user_name, u.user_name, role_id))
        return self_response('change user role successfully')
    else:
        return forbidden('does not have permissions')


@main.route('/api/control/query/<string:info>')
@login_required
@manage_permission_required
def admin_query(info):
    users = User.query.filter(User.user_name.like('%'+info+'%'), User.is_ban == False).all()
    if not users:
        return jsonify({
            "count": 0,
            "status": 'query result empty'})
    return jsonify({"count": len(users),
                    "status": [user.to_json() for user in users] })







