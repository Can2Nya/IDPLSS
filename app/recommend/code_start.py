# coding: utf-8
from app.models import  Course, TextResource, TestList


def code_start_course(user):
    """
    冷启动时根据用户注册时填写的标签推荐课程
    :param user:
    :return: course_list
    """
    user = user
    print "user interested field is %s" % user.interested_field
    str_interested_field = str(user.interested_field)
    interested_field = str_interested_field.split(":")
    course_list = []
    print 'interested list is %s' % course_list
    for filed in interested_field:
        course_list.append(Course.query.filter_by(course_category=int(filed)).all())
    print "course len is %s" % len(course_list)
    if len(course_list) < 3:
        return course_list
    else:
        return course_list[:3]


def code_start_text_resource(user):
    """
    冷启动时根据用户注册填写的标签推荐资源
    :param user:
    :return: text_resource_list
    """
    user = user
    str_interested_field = str(user.interested_field)
    interested_filed = str_interested_field.split(":")
    text_resource_list = []
    for field in interested_filed:
        text_resource_list.append(TextResource.query.filter_by(resource_category=int(field)).all())
    if len(text_resource_list) < 3:
        return text_resource_list
    else:
        return text_resource_list[:3]


def code_start_test(user):
    """
    冷启动时根据用户注册填写的标签推荐测试
    :param user:
    :return: test_list
    """
    user = user
    str_interested_field = str(user.interested_field)
    interested_filed = str_interested_field.split(":")
    print "user interested is %s" % str_interested_field
    test_list = []
    for field in interested_filed:
        test_list.append(TestList.query.filter_by(test_category=int(field)).all())
    if len(test_list) < 3:
        return test_list
    else:
        return test_list[:3]



