# coding: utf-8
from flask import jsonify
from app.models import Course, TextResource, TestList, User


def popular_course():
    """
    当没有登录时,默认推荐系统中热度高的课程(参与该课程学习的人度),默认推荐前3
    :return:
    """
    l = []
    all_course = Course.query.filter_by(show=True).all()
    [l.append(course.collect_sum) for course in all_course if course is not None]  # 将课程学习数量添加到list中:
    if len(l) < 3:
        return all_course
    else:
        collect_sum_reverse = sorted(l, reverse=True)   # 由大到小降序
        result = collect_sum_reverse[:3]  # 取前3进行推荐
        if result[0] == result[1] and result[0] == result[2]:
            recommend_course = Course.query.filter_by(collect_sum=result[0]).all()
            return recommend_course[:3]
        else:
            recommend = []
            for i in range(0, 3):
                recommend.append(Course.query.filter_by(collect_sum=result[i]).all())
            return recommend[:3]


def popular_text_resource():
    """
    根据文本资料的下载次数推荐,下载次数越高 默认认为该资料热度越高, 默认推荐前三
    :return:
    """
    l = []
    all_text_resources = TextResource.query.filter_by(show=True).all()
    [l.append(t_resource.download_sum) for t_resource in all_text_resources if t_resource is not None]  # 将文本资料下载学习添加到list中
    if len(l) < 3:
        return all_text_resources
    else:
        download_sum_reverse = sorted(l, reverse=True)   # 由大到小降序
        result = download_sum_reverse[:3]  # 取前3进行推荐
        if result[0] == result[1] and result[0] == result[2]:
            recommend_resource = TextResource.query.filter_by(download_sum=result[0]).all()
            return recommend_resource[:3]
        else:
            recommend = []
            for i in range(0, 3):
                recommend.append(TextResource.query.filter_by(download_sum=result[i]).all())
            return recommend[:3]


def popular_test():
    """
    推荐测试量很大的测试题目, 默认推荐前3
    :return:
    """
    l = []
    all_test = TestList.query.filter_by(show=True).all()
    [l.append(test.test_sum) for test in all_test if test is not None]  # 将课程学习数量添加到list中
    if len(l) < 3:
        return all_test
    else:
        test_sum_reverse = sorted(l, reverse=True)   # 由大到小降序
        result = test_sum_reverse[:3]  # 取前3进行推荐
        if result[0] == result[1] and result[0] == result[2]:
            recommend_test = TestList.query.filter_by(test_sum=result[0]).all()
            return recommend_test[:3]
        else:
            recommend = []
            for i in range(0, 3):
                recommend.append(TestList.query.filter_by(test_sum=result[i]).all())
            return recommend[:3]



