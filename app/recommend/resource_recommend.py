# coding: utf-8
from flask import g, jsonify
from app.models import User, TextResource, TextResourceBehavior
import math


def user_similarity_resource(user, k):
    """
    计算目标用户和其它用户之间的行为相识度
    :param user: 目标用户
    :param k:与k个用户进行相似度对比
    :return:返回保存与用户相似度的字典
    """
    # 数据准备,当前用户,其它用户
    target_user = user
    all_users = User.query.all()
    other_users = [u for u in all_users if u != target_user]
    # 计算目标用户的具有正反馈的文本资源
    target_collections = []
    resource_behaviors = TextResourceBehavior.query.filter_by(user_id=target_user.id).all()
    for behavior in resource_behaviors:
        target_collections.append(TextResource.query.filter_by(id=behavior.text_resource_id).first())

    # 计算相似度, w字典保存相相似度
    w = dict()
    for u in other_users:
        other_collections = []
        repeat_sum = 0
        user_behaviors = TextResourceBehavior.query.filter_by(user_id=u.id).all()
        for b in user_behaviors:
            other_collections.append(TextResource.query.filter_by(id=b.text_resource_id).first())
        for item_target in target_collections:
            for item_other in other_collections:
                if item_target == item_other:
                    repeat_sum += 1
                    print 'user %s repeat_sum is %s' % (u.user_name, repeat_sum)
                w[u.user_name] = repeat_sum
                w[u.user_name] /= math.sqrt(len(target_collections)*len(other_collections)*1.0)
    w_sort = sorted(w.iteritems(), key=lambda d: d[1], reverse=True)
    return w_sort


def resource_similarity():
    pass


def resource_recommend(user, k, n):
    pass

