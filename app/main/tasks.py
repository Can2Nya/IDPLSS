# -*- coding: utf-8 -*-
"""
    main.tasks
    ~~~~~~~~~~~~

    定义celery分布式任务队列任务

"""

import pickle
import jieba.analyse  # 使用结巴中文分词构造词云

from .. import celery
from .. import redis_store
from ..utils import logger
from ..models import TestList, Post, User, TestProblem, TestBehavior, TestRecord, AnswerRecord, db, \
    CourseNode, CourseNodeBehavior, CourseResource
from ..recommend import user_similarity_recommend, course_similarity_recommend, text_resources_recommend, \
    test_similarity_recommend, text_resources_user_recommend, test_user_similarity_recommend


# local val
REDIS_TIMEOUT = 50000  # 缓存的过期时间
TOP_K = 30  # 使用TF_IDF算法时返回的最大关键词个数


@celery.task
def get_tests(user, type_id):
    user = user
    type_id = type_id
    count = 1
    if type_id == 0:  # 根据UserCf计算
        tests = test_user_similarity_recommend(user, 10, 3)
        for x in range(1, len(tests)+1):
            if tests[x-1] is not None:
                test_name = str(user.id)+"_"+str(count)+"_user_test"
                redis_store.set(test_name, tests[x-1].id, REDIS_TIMEOUT)
                count += 1
        logger.info("test UserCf calc finish")
    else:     # 根据ItemCf计算
        tests = test_similarity_recommend(user, 10, 3)
        for x in range(1, len(tests)+1):
            if tests[x-1] is not None:
                test_name = str(user.id)+"_"+str(count)+"_item_test"
                redis_store.set(test_name, tests[x-1].id, REDIS_TIMEOUT)
                count += 1
        logger.info("test ItemCf calc finish")


@celery.task
def get_course(user, type_id):
    user = user
    type_id = type_id
    count = 1
    if type_id == 0:  # 根据UserCf计算
        courses = user_similarity_recommend(user, 10, 3)
        for x in range(1, len(courses)+1):
            if courses[x-1] is not None:
                course_name = str(user.id)+"_"+str(count)+"_user_course"
                redis_store.set(course_name, courses[x-1].id, REDIS_TIMEOUT)
                count += 1
        logger.info("course UserCf calc finish")
    else:
        courses = course_similarity_recommend(user, 10, 3)
        for x in range(1, len(courses)+1):
            if courses[x-1] is not None:
                course_name = str(user.id)+"_"+str(count)+"_item_course"
                redis_store.set(course_name, courses[x-1].id, REDIS_TIMEOUT)
                count += 1
        logger.info("course  ItemCf calc finish")


@celery.task
def get_text_resources(user, type_id):
    user = user
    type_id = type_id
    count = 1
    if type_id == 0:  # 根据UserCf计算
        text_resources = text_resources_user_recommend(user, 10, 3)
        for x in range(1, len(text_resources)+1):
            if text_resources[x-1] is not None:
                resource_name = str(user.id)+"_"+str(count)+"_user_resource"
                redis_store.set(resource_name, text_resources[x-1].id, REDIS_TIMEOUT)
                count += 1
        logger.info("resource UserCf calc finish")
    else:
        text_resources = text_resources_recommend(user, 10, 3)
        for x in range(1, len(text_resources)+1):
            if text_resources[x-1] is not None:
                resource_name = str(user.id)+"_"+str(count)+"_item_resource"
                redis_store.set(resource_name, text_resources[x-1].id, REDIS_TIMEOUT)
                count += 1
                print redis_store.get(resource_name)
        logger.info("resource ItemCf calc finish")


# @celery.task
def get_key_words(u):
    user = u
    text = list()
    posts = Post.query.filter_by(author_id=u.id).all()
    collection_posts = user.collection_posts
    courses = user.collection_courses
    text_resource = user.collection_text_resource
    test_records = user.test_record
    for u_post in posts:
        text.append(u_post.title)
        text.append(u_post.body)
    for p in collection_posts:
        text.append(p.title)
        text.append(p.body)
    for c in courses:
        text.append(c.course_name)
        text.append(c.description)
    for t in text_resource:
        text.append(t.resource_name)
        text.append(t.description)
    for r in test_records:
        test = TestList.query.filter_by(id=r.test_list_id).first()
        text.append(test.test_title)
        text.append(test.test_description)
        text.append(test.key_words)
    words = " ".join(text)
    res = jieba.analyse.extract_tags(words, topK=TOP_K, withWeight=True, allowPOS=())  # 只保留名词属性的词
    key_words = []
    for i in res:
        word_obj = dict()
        word_obj["key_word"] = i[0].encode('utf-8')
        word_obj["pv"] = int(i[1]*1000)
        word_obj["type"] = 0
        key_words.append(word_obj)
    resource_name = str(user.id)+"_words_cloud"
    redis_store.set(resource_name, pickle.dumps(key_words), REDIS_TIMEOUT)
    logger.info("calc key words complete")


def user_key_words(u):
    user = u
    text = list()
    posts = Post.query.filter_by(author_id=u.id).all()
    collection_posts = user.collection_posts
    courses = user.collection_courses
    text_resource = user.collection_text_resource
    test_records = user.test_record
    for u_post in posts:
        text.append(u_post.title)
        text.append(u_post.body)
    for p in collection_posts:
        text.append(p.title)
        text.append(p.body)
    for c in courses:
        text.append(c.course_name)
        text.append(c.description)
    for t in text_resource:
        text.append(t.resource_name)
        text.append(t.description)
    for r in test_records:
        test = TestList.query.filter_by(id=r.test_list_id).first()
        text.append(test.test_title)
        text.append(test.test_description)
        text.append(test.key_words)
    words = " ".join(text)
    return words


@celery.task
def delete_test(test_id):
    test = TestList.query.get(test_id).first()
    all_users = User.query.all()
    for u in all_users:   # 测试已经删除,将关联的测试记录也删除
        record = TestRecord.query.filter_by(answerer_id=u.id, test_list_id=test.id).first()
        if record:
            record.show = False
            db.session.add(record)
            all_answer_record = AnswerRecord.query.filter_by(answerer_id=u.id, test_record_id=record.id).all()
            if all_answer_record:
                for r in all_answer_record:
                    r.show = False
                    db.session.add(r)
    all_behaviors = TestBehavior.query.filter_by(test_id=test.id).all()
    if all_behaviors:
        for b in all_behaviors:
            b.show = False
            db.session.add(b)
    problems = TestProblem.query.filter_by(test_list_id=test.id).all()
    if problems:
        for p in problems:
            p.show = False
            db.session.add(p)
    db.session.commit()
    logger.info("delete test related resource successfully")


@celery.task
def delete_related_chapter(cid):
    nodes = CourseNode.query.filter_by(chapter_id=cid, show=True).all()
    if nodes:
        for n in nodes:
            n.show = False
            db.session.add(n)
    behaviors = CourseNodeBehavior.query.filter_by(chapter_id=cid, show=True).all()
    if behaviors:
        for b in behaviors:
            b.show = True
            db.session.add(b)
    resources = CourseResource.query.filterb_by(chapter_id=cid, show=True).all()
    if resources:
        for r in resources:
            r.show = False
    tests = TestList.query.filter_by(is_course_test=True, course_chapter_id=cid, show=True).all()
    if tests:
        for t in tests:
            t.show = False
            db.session.add(t)
            delete_test(t.id)  # 删除相关的测试依赖
    db.session.commit()
    logger.info("delete chapter related resource successfully")
