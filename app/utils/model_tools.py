# coding :utf-8
from datetime import datetime
from dateutil import tz


def set_model_attr(info, attr):
    if info.get(attr) is not None:
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
    if user is not None:
        return user
    else:
        return None


def time_transform(utc_time):
    from_zone = tz.gettz('UTC')
    to_zone = tz.gettz('CST')
    utc = utc_time
    utc = utc.replace(tzinfo=from_zone)
    local = utc.astimezone(to_zone)
    return datetime.strftime(local, "%Y-%m-%d %H:%M:%S")


def calc_count(type):
    return len(type.query.filter_by(show=True).all())

