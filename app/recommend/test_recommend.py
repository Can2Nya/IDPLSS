# coding: utf-8
import math
import pandas as pd
from app.models import TestList, TestBehavior, User


def test_user_index_calc(user):
    """
    优化:使用倒排表优化效率
    :param user 目标用户
    :param courses 目标用户没有正反馈的课程
    :return:
    """
    # 计算用户有正反馈的课程
    target_user = user
    target_collections = []
    all_user = User.query.all()
    other_users = [u for u in all_user if u != target_user]
    user_behaviors = TestBehavior.query.filter_by(user_id=target_user.id).all()
    for b in user_behaviors:
        target_collections.append(TestList.query.filter_by(id=b.test_id, show=True).first())
    # print "user collect course is %s" % target_collections
    index_dict = dict()  # 创建倒排表
    user_count_dict = dict()  # 保存相同的次数
    result_dict = dict()  # 相似度字典
    for test in target_collections:
        index_dict[test.id] = list()
    for u in other_users:
        for test in target_collections:
            if TestBehavior.query.filter_by(user_id=u.id, test_id=test.id).first():
                index_dict[test.id].append(u.id)
    for cid, user_list in index_dict.items():
        for uid in user_list:
            if user_count_dict.get(uid) is None:
                user_count_dict[uid] = 1
            else:
                user_count_dict[uid] += 1
    # print "user count dict is %s" % user_count_dict
    for uid, count in user_count_dict.items():
        result_dict[uid] = count
        result_dict[uid] /= math.sqrt(len(target_collections*len(TestBehavior.query.filter_by(user_id=uid).all())))
    w_sort = sorted(result_dict.iteritems(), key=lambda d: d[1], reverse=True)
    # print "result dict is %s" % w_sort
    return w_sort, target_collections


def test_user_similarity_recommend(user, k, n):
    """
    对保存用户相似度的字典进行处理,得出推荐结果(UserCf)
    :param user: 目标用户
    :param k: k个与目标用户相似度最高的用户
    :param n: 推荐n个结果给用户
    :return:
    """
    similarity_result, target_tests = test_user_index_calc(user)
    k_similarity_user = similarity_result[:k]
    all_tests = TestList.query.all()
    # calc = 0
    if not target_tests != all_tests:   # 当所有的test都被用户收藏 返回空
        return []
    other_tests = [test for test in all_tests if test not in target_tests]
    k_similarity_user_dict = dict(k_similarity_user)  # 转化为字典方便查询
    interested_tests = dict()
    for other_c in other_tests:
        interested_tests[other_c.id] = 0
    # 计算对其它课程有反馈的用户  计算相似用户和反馈用户的交集和
    for c in other_tests:
        users = []
        behaviors = TestBehavior.query.filter_by(test_id=c.id).all()
        for b in behaviors:
            users.append(b.user_id)  # 得出对课程有正反馈的用户id集合
        for k, v in k_similarity_user:
            for u in users:
                if k == u:   # 得出交集用户后求和
                    interested_tests[c.id] += k_similarity_user_dict.get(u)
                    # calc += 1
    interested_tests_list = sorted(interested_tests.iteritems(), key=lambda d: d[1], reverse=True)
    # 将课程按照兴趣度进行排序
    tests_result = []
    for x in interested_tests_list[:n]:
        tests_result.append(TestList.query.filter_by(id=x[0], show=True).first())
    return tests_result


def test_index_pandas_calc(user_courses, _other_users):
    """
    使用pandas优化数据处理,计算用户正反馈课程与其它课程的相似度
    :param user_courses:
    :param _other_users:
    :return:
    """
    target_user_tests = user_courses
    other_users = _other_users
    all_tests = TestList.query.filter_by(show=True).all()
    other_tests = [c for c in all_tests if c not in target_user_tests]
    index_dict = dict()  # 用户-课程倒排表
    test_data_frame = pd.DataFrame(data=0, index=[c.id for c in target_user_tests],
                                     columns=list(c.id for c in other_tests))  # 保存结果的DataFrame对象
    for u in other_users:
        index_dict[u.id] = list()
        u_behaviors = TestBehavior.query.filter_by(user_id=u.id).all()
        for b in u_behaviors:
            c = TestList.query.filter_by(id=b.test_id, show=True).first()
            index_dict[u.id].append(c.id)
        # print 'u %s over' % u.id
    for test in target_user_tests:
        for uid, u_test_id in index_dict.items():  # 利用倒排表进行数据处理,遍历其它用户有正反馈的课程
            if test.id in u_test_id:
                for cid in u_test_id:
                    if cid != test.id:
                        try:
                            test_data_frame.loc[test.id, cid] += 1
                        except KeyError:
                            pass
    for u_test in target_user_tests:
        for o_test in other_tests:
            try:
                if test_data_frame.loc[u_test.id, o_test.id] != 0:
                    u_test_count = len(TestBehavior.query.filter_by(test_id=u_test.id).all())
                    o_test_count = len(TestBehavior.query.filter_by(test_id=o_test.id).all())
                    test_data_frame.loc[u_test.id, o_test.id] /= math.sqrt(u_test_count*o_test_count*1.0)
            except KeyError:
                pass
    return test_data_frame.T    # 将DataFrame进行转置并返回


def test_similarity_recommend(user, k, n):
    """
    根据课程的相似度进行推荐(ItemCf)
    :param user:
    :param k:
    :param n:
    :return:
    """
    target_user = user
    all_users = User.query.all()
    all_tests = TestList.query.all()
    other_users = [u for u in all_users if u != target_user]  # 其它用户
    target_collections = []   # 目标用户
    target_behaviors = TestBehavior.query.filter_by(user_id=target_user.id).all()
    for b in target_behaviors:
        c = TestList.query.filter_by(id=b.test_id, show=True).first()
        target_collections.append(c)
    if not target_collections != all_tests:  # 当所有的课程都已经被用户收藏时  没有推荐
        return []
    if len(target_collections) < 3:
        k = len(target_collections)
    result_dict = dict()
    similarity_data_frame = test_index_pandas_calc(target_collections, other_users)
    for index, test in enumerate(target_collections):
        no_repeate_list = []
        for y in range(0, k):
            cid = test.id
            r = similarity_data_frame.sort_values(by=cid, ascending=False).iloc[y, index]
            if r > 0:
                result_list = similarity_data_frame[cid][similarity_data_frame[cid] == r].index.tolist()
                for i in result_list:  # 数据过滤,清除重复的索引
                    if i not in no_repeate_list:
                        no_repeate_list.append(i)
        for r_index in no_repeate_list:     # 根据公式计算每门课程的相似度
            if result_dict.get(r_index) is None:
                result_dict[r_index] = similarity_data_frame.loc[r_index, test.id]
            else:
                result_dict[r_index] += similarity_data_frame.loc[r_index, test.id]
    w_sort = sorted(result_dict.iteritems(), key=lambda d: d[1], reverse=True)
    recommend_tests = []
    for x in w_sort[:n]:
        recommend_tests.append(TestList.query.filter_by(id=x[0], show=True).first())
    return recommend_tests
