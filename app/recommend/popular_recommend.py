# coding: utf-8
from flask import jsonify
from app.models import Course, TextResource, TestList, User


def popular_course():
    """
    当没有登录时,默认推荐系统中热度高的课程(参与该课程学习的人度),默认推荐前3
    :return:
    """
    l = []
    recommend_list = []
    all_course = Course.query.filter_by(show=True).all()
    [l.append(course.collect_sum) for course in all_course if course is not None]  # 将课程学习数量添加到list中:
    if len(l) < 3:
        for c in all_course:
            recommend_list.append(c)
        return recommend_list
    else:
        collect_sum_reverse = sorted(l, reverse=True)   # 由大到小降序
        result = collect_sum_reverse[:3]  # 取前3进行推荐
        result = set(result)   # 收藏数字数字去重
        for count in result:
            courses = Course.query.filter_by(collect_sum=count).all()
            for course in courses:
                recommend_list.append(course) 
        return recommend_list[:3]


def popular_text_resource():
    """
    根据文本资料的下载次数推荐,下载次数越高 默认认为该资料热度越高, 默认推荐前三
    :return:
    """
    l = []
    recommend_list = []
    all_text_resources = TextResource.query.filter_by(show=True).all()
    [l.append(t_resource.download_sum) for t_resource in all_text_resources if t_resource is not None]  # 将文本资料下载学习添加到list中
    if len(l) < 3:
        for t in all_text_resources:
            recommend_list.append(t)
        return recommend_list
    else:
        download_sum_reverse = sorted(l, reverse=True)   # 由大到小降序
        result = download_sum_reverse[:3]  # 取前3进行推荐
        result = set(result)
        for count in result:
            resources = TextResource.query.filter_by(download_sum=count).all()
            for r in resources:
                recommend_list.append(r)
            return recommend_list[:3]


def popular_test():
    """
    推荐测试量很大的测试题目, 默认推荐前3
    :return:
    """
    l = []
    recommend_test = []
    all_test = TestList.query.filter_by(show=True).all()
    [l.append(test.test_sum) for test in all_test if test is not None]  # 将课程学习数量添加到list中
    if len(l) < 3:
        for t in all_test:
            recommend_test.append(t)
        return recommend_test
    else:
        test_sum_reverse = sorted(l, reverse=True)   # 由大到小降序
        result = test_sum_reverse[:3]  # 取前3进行推荐
        result = set(result)
        for count in result:
            tests = TestList.query.filter_by(test_sum=count).all()
            for t in tests:
                recommend_test.append(t)
        return recommend_test[:3]



