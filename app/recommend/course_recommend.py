# coding: utf-8
from app.models import Course, CourseBehavior, User
import pandas as pd
import math


def user_similarity_calc(user):
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
    # 计算目标用户的学习课程
    target_collections = []
    course_behaviors = CourseBehavior.query.filter_by(user_id=target_user.id).all()
    for behavior in course_behaviors:
        target_collections.append(Course.query.filter_by(id=behavior.course_id, show=True).first())
    # 计算相似度, w字典保存相相似度
    # print "user collection courses is %s" % target_collections
    w = dict()
    for u in other_users:
        other_collections = []
        repeat_sum = 0
        user_behaviors = CourseBehavior.query.filter_by(user_id=u.id).all()
        for b in user_behaviors:
            other_collections.append(Course.query.filter_by(id=b.course_id, show=True).first())
        for item_target in target_collections:
            for item_other in other_collections:
                if item_target == item_other:
                    repeat_sum += 1
        if repeat_sum != 0:
            # print "user id is %s count is %s " % (u.id, repeat_sum)
            w[u.id] = repeat_sum
            w[u.id] /= math.sqrt(len(target_collections)*len(other_collections)*1.0)
    w_sort = sorted(w.iteritems(), key=lambda d: d[1], reverse=True)
    return w_sort, target_collections


def user_index_calc(user):
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
    user_behaviors = CourseBehavior.query.filter_by(user_id=target_user.id).all()
    for b in user_behaviors:
        target_collections.append(Course.query.filter_by(id=b.course_id, show=True).first())
    # print "user collect course is %s" % target_collections
    index_dict = dict()  # 创建倒排表
    user_count_dict = dict()  # 保存相同的次数
    result_dict = dict()  # 相似度字典
    for course in target_collections:
        index_dict[course.id] = list()
    for u in other_users:
        for course in target_collections:
            if CourseBehavior.query.filter_by(user_id=u.id, course_id=course.id).first():
                index_dict[course.id].append(u.id)
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
        result_dict[uid] /= math.sqrt(len(target_collections*len(CourseBehavior.query.filter_by(user_id=uid).all())))
    w_sort = sorted(result_dict.iteritems(), key=lambda d: d[1], reverse=True)
    # print "result dict is %s" % w_sort
    return w_sort, target_collections


def user_similarity_recommend(user, k, n):
    """
    对保存用户相似度的字典进行处理,得出推荐结果(UserCf)
    :param user: 目标用户
    :param k: k个与目标用户相似度最高的用户
    :param n: 推荐n个结果给用户
    :return:
    """
    recommend_type = 'index'  # 算法类型  使用倒排索引算法,效率高
    if recommend_type == 'user':
        similarity_result, target_courses = user_similarity_calc(user)
    else:
        similarity_result, target_courses = user_index_calc(user)
    # print "user collect course is %s" % target_courses
    # print "end result is %s" % similarity_result
    k_similarity_user = similarity_result[:k]
    all_courses = Course.query.filter_by(show=True).all()
    calc = 0
    other_courses = [course for course in all_courses if course not in target_courses]
    k_similarity_user_dict = dict(k_similarity_user)  # 转化为字典方便查询
    interested_course = dict()
    for other_c in other_courses:
        interested_course[other_c.id] = 0
    # 计算对其它课程有反馈的用户  计算相似用户和反馈用户的交集和
    for c in other_courses:
        users = []
        behaviors = CourseBehavior.query.filter_by(course_id=c.id).all()
        for b in behaviors:
            users.append(b.user_id)  # 得出对课程有正反馈的用户id集合
        for k, v in k_similarity_user:
            for u in users:
                if k == u:   # 得出交集用户后求和
                    interested_course[c.id] += k_similarity_user_dict.get(u)
                    calc += 1
    interested_course_list = sorted(interested_course.iteritems(), key=lambda d: d[1], reverse=True)
    # 将课程按照兴趣度进行排序
    courses_result = []
    for x in interested_course_list[:n]:
        courses_result.append(Course.query.filter_by(id=x[0]).first())
    return courses_result


def course_index_pandas_calc(user_courses, _other_users):
    """
    使用pandas优化数据处理,计算用户正反馈课程与其它课程的相似度
    :param user_courses:
    :param _other_users:
    :return:
    """
    target_user_courses = user_courses
    other_users = _other_users
    all_courses = Course.query.filter_by(show=True).all()
    other_courses = [c for c in all_courses if c not in target_user_courses]
    index_dict = dict()  # 用户-课程倒排表
    course_data_frame = pd.DataFrame(data=0, index=[c.id for c in target_user_courses],
                                     columns=list(c.id for c in other_courses))  # 保存结果的DataFrame对象
    for u in other_users:
        index_dict[u.id] = list()
        u_behaviors = CourseBehavior.query.filter_by(user_id=u.id).all()
        for b in u_behaviors:
            c = Course.query.filter_by(id=b.course_id, show=True).first()
            index_dict[u.id].append(c.id)
        # print 'u %s over' % u.id
    for course in target_user_courses:
        for uid, u_courses_id in index_dict.items():  # 利用倒排表进行数据处理,遍历其它用户有正反馈的课程
            if course.id in u_courses_id:
                for cid in u_courses_id:
                    if cid != course.id:
                        try:
                            course_data_frame.loc[course.id, cid] += 1
                        except KeyError:
                            pass
    for u_course in target_user_courses:
        for o_course in other_courses:
            try:
                if course_data_frame.loc[u_course.id, o_course.id] != 0:
                    u_course_count = len(CourseBehavior.query.filter_by(course_id=u_course.id).all())
                    o_course_count = len(CourseBehavior.query.filter_by(course_id=o_course.id).all())
                    course_data_frame.loc[u_course.id, o_course.id] /= math.sqrt(u_course_count*o_course_count*1.0)
            except KeyError:
                pass
    return course_data_frame.T    # 将DataFrame进行转置并返回


def course_similarity_recommend(user, k, n):
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
    target_collections = []   # 目标用户
    target_behaviors = CourseBehavior.query.filter_by(user_id=target_user.id).all()
    for b in target_behaviors:
        c = Course.query.filter_by(id=b.course_id, show=True).first()
        target_collections.append(c)
    result_dict = dict()
    similarity_data_frame = course_index_pandas_calc(target_collections, other_users)
    for index, course in enumerate(target_collections):
        # print similarity_data_frame.sort_values(by=course.id, ascending=False)
        no_repeate_list = []
        for y in range(0, k):
            cid = course.id
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
                result_dict[r_index] = similarity_data_frame.loc[r_index, course.id]
            else:
                result_dict[r_index] += similarity_data_frame.loc[r_index, course.id]
    w_sort = sorted(result_dict.iteritems(), key=lambda d: d[1], reverse=True)
    # print w_sort   # 保存排好序的各个课程相似度
    recommend_courses = []
    for x in w_sort[:n]:
        recommend_courses.append(Course.query.filter_by(id=x[0]).first())
    return recommend_courses
