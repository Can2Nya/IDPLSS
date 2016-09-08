# coding :utf-8


# def id_change_name(type, uid):
#     db_model = {
#         'user', User,
#         'role', Role,
#         'post', Post,
#
#     }
#     return db_model[type].query.filter_by(id=uid).first()


def set_model_attr(info, attr):
    if info.get(attr) is not None:
        return info.get(attr)
    else:
        pass
