# -*- coding: utf-8 -*-
from flask import g, jsonify

import jieba

from . import main
from .. import redis_store
from .decorators import login_required
from .tasks import user_key_words
from ..utils import logger
from ..models import User, Course, CourseChapter, CourseResource, CourseNodeBehavior, CourseNode, CourseBehavior, \
    TestList, TestRecord

# user_count:[]
# subject:[]
# sex:[]
# interested_field:[]
# learn_other_course:[]
# test_accuracy[]

TOP_K = 40
REDIS_TIMEOUT = 50000


@main.route('/api/analyse/course')
@login_required
def course_analyse():
    user = g.current_user
    courses = Course.query.filter_by(author_id=user.id).all()
    subject_list = [x for x in range(1, 13)]
    res = {
        "count": len(courses),
        "course": []
    }
    for course in courses:
        res_course = dict()
        users = []
        word_list = []
        subject_dict = dict.fromkeys(subject_list, 0)
        sex_count = 0
        subject_res_list = []
        behaviors = CourseBehavior.query.filter_by(course_id=course.id).all()
        for b in behaviors:
            user = User.query.filter(id=b.user_id).first()
            if user:
                users.append(user)
        for u in users:
            if u.sex == 0:
                sex_count += 1
            subject_dict[u.subject] += 1  # 计算专业分布
            word_list.append(user_key_words(u))
        # 计算学习过该课程的用户关键词
        words = ' '.join(word_list)
        res = jieba.analyse.extract_tags(words, topK=TOP_K, withWeight=True, allowPOS=())
        key_words = []
        for i in res:
            word_obj = dict()
            word_obj["key_word"] = i[0].encode('utf-8')
            word_obj["pv"] = int(i[1]*1000)
            word_obj["type"] = 0
            key_words.append(word_obj)
        logger.info("calc course key words complete")
        # 计算学习过该课程的用户专业分布
        count = 0
        for k, v in subject_dict.items():
            count += v
        for k, v in subject_dict.items():
            temp_dict = dict()
            temp_dict['category'] = k
            try:
                temp_dict['value'] = round((v/count), 2)
            except ZeroDivisionError:
                temp_dict['value'] = 0
            subject_res_list.append(temp_dict)
            temp_dict['obj'] = 'me'
        # 计算测试的正确率
        res_course['stu_count'] = len(users)
        res_course['sex'] = {'male': sex_count, 'female': len(users)-sex_count}
        res_course['subject'] = subject_res_list
        res_course['interested_field'] = key_words
        res_course['test_avg_accuracy'] = get_test_accuracy(course_id)
        res['course'].append(res_course)
    return jsonify(res)


def get_test_accuracy(course_id):
    tests = TestList.query.filter_by(is_course_test=True, course_id=course_id).all()
    accuracy = 0
    res = dict()
    for t in tests:
        records = TestRecord.query.filter_by(test_list_id=t.id).all()
        for r in records:
            accuracy += r.test_accuracy
        try:
            tmp_accuracy = accuracy / len(records)
        except ZeroDivisionError:
            tmp_accuracy = 0
        res[t.id] = tmp_accuracy
    return res
