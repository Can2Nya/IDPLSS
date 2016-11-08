# coding: utf-8
from app.models import  Course, TextResource, TestList


def code_start_course(user):
    """
    冷启动时根据用户注册时填写的标签推荐课程
    :param user:
    :return: course_list
    """
    user = user
    interested_field = user.interested_field.split(":")
    print "interested field is %s" % interested_field
    course_list = []
    for filed in interested_field:
        c = Course.query.filter_by(course_category=int(filed)).order_by(Course.timestamp.desc()).first()
        if c is not None:
            course_list.append(c)
    print "course is %s" % course_list
    if len(course_list) < 3:
        print "course count is %s" % len(course_list)
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
    interested_filed = user.interested_field.split(":")
    text_resource_list = []
    for field in interested_filed:
        t_resource = TextResource.query.filter_by(resource_category=int(field)).order_by(TextResource.timestamp.desc()).first()
        if t_resource is not None:
            text_resource_list.append(t_resource)
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
    interested_filed = user.interested_field.split(":")
    test_list = []
    for field in interested_filed:
        test = TestList.query.filter_by(test_category=int(field)).order_by(TestList.timestamp.desc()).first()
        if test is not None:
            test_list.append(test)
    if len(test_list) < 3:
        return test_list
    else:
        return test_list[:3]



