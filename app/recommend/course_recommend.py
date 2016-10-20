# coding: utf-8
from app.models import Course, CourseBehavior, User
import math


def user_similarity_calc(user, K, R):
    """
    计算目标用户和其它用户之间的行为相识度
    :param user: 目标用户
    :param K: 与目标用户行为相似度最接近的K个用户
    :param R: 推荐R个结果
    :return:
    """
    # 数据准备,当前用户,其它用户
    target_user = user
    all_users = User.query.all()
    other_users = all_users.remove(target_user)
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
                    w[target_user][u] = repeat_sum
                    w[target_user][u] /= math.sqrt(len(target_collections)*len(other_collections)*1.0)
    return w


def course_similarity_calc(user, K, N):
    """
    计算目标学习过的课程与其它课程的相似度
    :param user:
    :param K:
    :param N:
    :return:
    """
    # 数据准备 目标用户用户学习过的课程,全部用户
    all_user = User.query.all()
    target_user = user
    target_behaviors = CourseBehavior.query.filter_by(user_id=target_user.id).all()
    collect_courses = []
    for behavior in target_behaviors:
        collect_courses.append(Course.query.filter_by(id=behavior.course_id).first())
    other_courses = Course.query.all()
    for c in collect_courses:
        other_courses.remove(c)
    w = dict()
    for course in collect_courses:
        course_count = len(CourseBehavior.query.filter_by(course_id=course.id).all())
        repeted_sum = 0
        for other in other_courses:
            other_count = len(CourseBehavior.query.filter_by(couse_id=other.id).all())
            # 计算同时喜欢course和other_course的总人数
            for u in all_user:
                if course in u.collection_courses.all() and other in u.collection_courses.all():
                    repeted_sum += 1
        d[course][other] = repeted_sum /math.sqrt(course_count*other_count)
    return




