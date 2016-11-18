# coding: utf-8
from app.models import TextResource, TextResourceBehavior, User
import pandas as pd
import math


def user_index_calc(user):
    """
    优化:使用倒排表优化效率
    :param user 目标用户
    :return:
    """
    # 计算用户有正反馈的课程
    target_user = user
    target_collections = user.collection_text_resource
    all_user = User.query.all()
    other_users = [u for u in all_user if u != target_user]
    index_dict = dict()  # 创建倒排表
    user_count_dict = dict()  # 保存相同的次数
    result_dict = dict()  # 相似度字典
    for t_resource in target_collections:
        index_dict[t_resource.id] = list()
    for u in other_users:
        for t_resource in target_collections:
            if TextResourceBehavior.query.filter_by(user_id=u.id, text_resource_id=t_resource.id).first():
                index_dict[t_resource.id].append(u.id)
                # continue
        # print 'calc user %s over' % u.id
    # print "index_dict is %s " % index_dict
    for cid, user_list in index_dict.items():
        for uid in user_list:
            if user_count_dict.get(uid) is None:
                user_count_dict[uid] = 1
            else:
                user_count_dict[uid] += 1
    # print "user count dict is %s" % user_count_dict
    for uid, count in user_count_dict.items():
        result_dict[uid] = count
        result_dict[uid] /= math.sqrt(len(target_collections.count()*len(TextResourceBehavior.query.filter_by(user_id=uid).all())))
    w_sort = sorted(result_dict.iteritems(), key=lambda d: d[1], reverse=True)
    # print "result dict is %s" % w_sort
    return w_sort, target_collections


def text_resources_user_recommend(user, k, n):
    """
    对保存用户相似度的字典进行处理,得出推荐结果(UserCf)
    :param user: 目标用户
    :param k: k个与目标用户相似度最高的用户
    :param n: 推荐n个结果给用户
    :return:
    """
    similarity_result, target_t_resources = user_index_calc(user)
    # print "user collect text resources is %s" % target_t_resources
    # print "end result is %s" % similarity_result
    k_similarity_user = similarity_result[:k]
    all_resources = TextResource.query.filter_by(show=True).all()
    if not all_resources != target_t_resources:
        return []  # 如果全部资源已经下载过了  返回空
    calc = 0
    other_resources = [t_resource for t_resource in all_resources if t_resource not in target_t_resources]
    k_similarity_user_dict = dict(k_similarity_user)  # 转化为字典方便查询
    interested_resources = dict()
    for other_c in other_resources:
        interested_resources[other_c.id] = 0
    # 计算对其它课程有反馈的用户  计算相似用户和反馈用户的交集和
    for c in other_resources:
        users = []
        behaviors = TextResourceBehavior.query.filter_by(text_resource_id=c.id).all()
        for b in behaviors:
            users.append(b.user_id)  # 得出对课程有正反馈的用户id集合
        for k, v in k_similarity_user:
            for u in users:
                if k == u:   # 得出交集用户后求和
                    interested_resources[c.id] += k_similarity_user_dict.get(u)
                    calc += 1
    interested_resources_list = sorted(interested_resources.iteritems(), key=lambda d: d[1], reverse=True)
    # 将课程按照兴趣度进行排序
    resources_result = []
    for x in interested_resources_list[:n]:
        resources_result.append(TextResource.query.filter_by(id=x[0], show=True).first())
    return resources_result


def text_resource_index_pandas_calc(user_resources, _other_users):
    """
    使用pandas优化数据处理,计算用户正反馈课程与其它课程的相似度
    :param user_resources:
    :param _other_users:
    :return:
    """
    target_user_resources = user_resources
    other_users = _other_users
    all_resources = TextResource.query.filter_by(show=True).all()
    other_resources = [c for c in all_resources if c not in target_user_resources]
    index_dict = dict()  # 用户-课程倒排表
    resources_data_frame = pd.DataFrame(data=0, index=[c.id for c in target_user_resources],
                                     columns=list(c.id for c in other_resources))  # 保存结果的DataFrame对象
    for u in other_users:
        index_dict[u.id] = list()
        u_behaviors = TextResourceBehavior.query.filter_by(user_id=u.id).all()
        for b in u_behaviors:
            c = TextResource.query.filter_by(id=b.text_resource_id, show=True).first()
            index_dict[u.id].append(c.id)
        # print 'u %s over' % u.id
    # print "---data frame is \n %s" % resources_data_frame
    for t_resource in target_user_resources:
        for uid, u_resources_id in index_dict.items():  # 利用倒排表进行数据处理,遍历其它用户有正反馈的课程
            if t_resource.id in u_resources_id:
                for cid in u_resources_id:
                    if cid != t_resource.id:
                        try:
                            resources_data_frame.loc[t_resource.id, cid] += 1
                        except KeyError:
                            pass
    # print "data frame is--- \n %s" % resources_data_frame
    for u_resource in target_user_resources:
        for o_resource in other_resources:
            try:
                if resources_data_frame.loc[u_resource.id, o_resource.id] != 0:
                    u_resource_count = len(TextResourceBehavior.query.filter_by(text_resource_id=u_resource.id).all())
                    o_resource_count = len(TextResourceBehavior.query.filter_by(text_resource_id=o_resource.id).all())
                    resources_data_frame.loc[u_resource.id, o_resource.id] /= math.sqrt(u_resource_count*o_resource_count*1.0)
            except KeyError:
                pass
    return resources_data_frame.T    # 将DataFrame进行转置并返回


def text_resources_recommend(user, k, n):
    """
    根据课程的相似度进行推荐(ItemCf)
    :param user:
    :param k:
    :param n:
    :return:
    """
    target_user = user
    all_users = User.query.all()
    other_users = [u for u in all_users if u != target_user]  # 其它用户
    target_collections = user.collection_text_resource
    all_resources = TextResource.query.all()
    if not target_collections != all_resources:
        return []
    count_other_resource = len(all_resources) - target_collections.count()
    if count_other_resource < k:
        k = count_other_resource
    result_dict = dict()
    similarity_data_frame = text_resource_index_pandas_calc(target_collections, other_users)
    for index, t_resource in enumerate(target_collections):
        # print similarity_data_frame.sort_values(by=t_resource.id, ascending=False)
        no_repeate_list = []
        for y in range(0, k):
            cid = t_resource.id
            r = similarity_data_frame.sort_values(by=cid, ascending=False).iloc[y, index]
            # print r
            if r > 0:
                result_list = similarity_data_frame[cid][similarity_data_frame[cid] == r].index.tolist()
                # print "result list is %s" % result_list
                for i in result_list:  # 数据过滤,清楚重复的索引
                    if i not in no_repeate_list:
                        no_repeate_list.append(i)
        # print "no repe list is %s" % no_repeate_list
        for r_index in no_repeate_list:     # 根据公式计算每门课程的相似度
            if result_dict.get(r_index) is None:
                result_dict[r_index] = similarity_data_frame.loc[r_index, t_resource.id]
            else:
                result_dict[r_index] += similarity_data_frame.loc[r_index, t_resource.id]
    w_sort = sorted(result_dict.iteritems(), key=lambda d: d[1], reverse=True)
    # print w_sort   # 保存排好序的各个课程相似度
    recommend_text_resources = []
    for x in w_sort[:n]:
        recommend_text_resources.append(TextResource.query.filter_by(id=x[0], show=True).first())
    return recommend_text_resources
