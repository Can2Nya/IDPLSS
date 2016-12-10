# coding :utf-8
from datetime import datetime
from dateutil import tz


def set_model_attr(info, attr):
    if info.get(attr):
        return info.get(attr)
    else:
        pass


def user_info_transform(uid, attr):
    from app.models import User
    attributes = ['name', 'about_me', 'avatar']
    user = User.query.get_or_404(uid)
    if attributes[0] == attr:
        return user.name
    elif attributes[1] == attr:
        return user.about_me
    elif attributes[2] == attr:
        return user.avatar
    else:
        pass


def id_change_user(uid):
    from app.models import User
    user = User.query.get_or_404(uid)
    if user:
        return user
    return None


def time_transform(utc_time, get_hour=False):  # UTC time change to CST time
    from_zone = tz.gettz('UTC')
    to_zone = tz.gettz('CST')
    utc = utc_time
    utc = utc.replace(tzinfo=from_zone)
    local = utc.astimezone(to_zone)
    if get_hour:
        return datetime.strftime(local, "%H")
    return datetime.strftime(local, "%Y-%m-%d %H:%M:%S")


def calc_count(type):
    return len(type.query.filter_by(show=True).all())


def have_school_permission(user):
    from app.models import Role, User
    if user is None:
        return False
    else:
        user = User.query.filter_by(id=user.id).first()
        admin = Role.query.filter_by(role_name='Admin').first()
        school_admin = Role.query.filter_by(role_name='SchoolAdmin')
        if (user.role == admin) or (user.role == school_admin):
            return True
        return False

def comment_count(pid):
    from app.models import Post, PostComment
    post = Post.query.get(pid)
    if not post:
        return 0
    comments = PostComment.query.filter_by(post_id=pid, show=True).all()
    return len(comments)


