# coding: utf-8
from app.models import Course, CourseBehavior, User
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
        target_collections.append(Course.query.filter_by(id=behavior.course_id).first())
    # 计算相似度, w字典保存相相似度
    w = dict()
    for u in other_users:
        other_collections = []
        repeat_sum = 0
        user_behaviors = CourseBehavior.query.filter_by(user_id=u.id).all()
        for b in user_behaviors:
            other_collections.append(Course.query.filter_by(id=b.course_id).first())
        for item_target in target_collections:
            for item_other in other_collections:
                if item_target == item_other:
                    repeat_sum += 1
                w[u.id] = repeat_sum
                w[u.id] /= math.sqrt(len(target_collections)*len(other_collections)*1.0)
    w_sort = sorted(w.iteritems(), key=lambda d: d[1], reverse=True)
    return w_sort, target_collections


def user_similarity_recommend(user, k, n):
    """
    对保存用户相似度的字典进行处理,得出推荐结果
    :param user: 目标用户
    :param k: k个与目标用户相似度最高的用户
    :param n: 推荐n个结果给用户
    :return:
    """
    similarity_result, target_courses = user_similarity_calc(user)
    k_similarity_user = similarity_result[:k]
    k_similarity_user_dict = dict(k_similarity_user)  # 转化为字典方便查询
    all_courses = Course.query.all()
    calc = 0
    other_courses = [course for course in all_courses if course not in target_courses]
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


def course_similarity_calc(user, K):
    """
    计算目标学习过的课程与其它课程的相似度  分子:同时喜欢课程i和课程j的人数/sqrt(喜欢i的人数*喜欢j的人数)
    :param user:
    :param K:
    :return:目标用户课程与其它课程之间的相似度
    """
    # 数据准备 目标用户用户学习过的课程,全部用户
    all_user = User.query.all()
    target_user = user
    target_behaviors = CourseBehavior.query.filter_by(user_id=target_user.id).all()
    collect_courses = []
    for behavior in target_behaviors:
        collect_courses.append(Course.query.filter_by(id=behavior.course_id).first())
    print "collect count is %s" % len(collect_courses)
    all_courses = Course.query.all()
    other_courses = [course for course in all_courses if course not in collect_courses]
    print "other course count is %s" % len(other_courses)
    w = dict()
    calc = 0
    for course in collect_courses:
        for other in other_courses:
            w_2d = dict()  # 二维字典 保存课程与课程之间的相似度
            repeat_sum = 0
            # 计算同时喜欢course和other_course的总人数
            for u in all_user:
                if u.is_collecting_course(course) and u.is_collecting_course(other): # 用户同时收藏两门课的人数
                    repeat_sum += 1
            w[course.id] = w_2d
            try:
                w_2d[other.id] = repeat_sum / math.sqrt(course.collect_sum*other.collect_sum)
            except ZeroDivisionError:
                w_2d[other.id] = 0
            calc += 1
            print "calc %s is over result is %s" % (calc, w[course.id])
    print calc
    return w, collect_courses


def course_similarity_recommend(user, k, n):
    course_dict, user_collect_courses = course_similarity_calc(user, k)
    print "courses dict is %s" % course_dict
    return "hello"


