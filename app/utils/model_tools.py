# coding :utf-8


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


