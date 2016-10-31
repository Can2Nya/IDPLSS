# coding:utf-8
from flask import jsonify, g
from app.main import main
from app.main.decorators import user_login_info
from app.models import User, Course, TextResource, TestList, CourseBehavior, TextResourceBehavior, TestBehavior
from app.recommend.code_start import code_start_course, code_start_text_resource, code_start_test
from app.recommend.course_recommend import user_similarity_recommend, course_similarity_recommend
from app.recommend.resource_recommend import text_resources_user_recommend,  text_resources_recommend
from app.recommend.test_recommend import test_similarity_recommend, test_user_similarity_recommend
from app.recommend.popular_recommend import popular_course, popular_text_resource, popular_test
import datetime


@main.route('/api/recommend/courses/<int:type_id>')
@user_login_info
def recommend_course(type_id):
    """
    推荐方式:未登录采用热度推荐,登录但是行为很少采用冷启动推荐,登录数据多采用算法(用户相似或者课程相似)推荐
    :param: type_id(采用的推荐算法的类型ItemCf或者UserCf)
    :return: course(json)
    """
    user = g.current_user
    if user is None:
        courses = popular_course()
        return jsonify({
            "count": len(courses),
            "recommend_courses": [course[0].to_json() for course in courses]
        })
    else:
        user_behaviors = CourseBehavior.query.filter_by(user_id=user.id).all()
        if len(user_behaviors) == 0:   # 当用户行为的数量少于X时, 由于数据量少计算没有意义 因为根据用户兴趣标签来进行推荐
            print 'code start calc start'
            courses = code_start_course(user)
            return jsonify({
                "count": len(courses),
                "recommend_courses": [course[0].to_json() for course in courses]
            })
        else:
            if type_id == 0:
                print "user similarity start"
                t1 = datetime.datetime.utcnow()
                courses = user_similarity_recommend(user, 10, 3)
                t2 = datetime.datetime.utcnow()
                print "speed time %s s" % (t2-t1).seconds
                return jsonify({
                    "count": len(courses),
                    "recommend_courses": [course.to_json() for course in courses]

                })
            else:
                print "course similarity start"
                t1 = datetime.datetime.utcnow()
                courses = course_similarity_recommend(user, 10, 3)
                t2 = datetime.datetime.utcnow()
                print "speed time %s s" % (t2-t1).seconds
                return jsonify({
                    "count": len(courses),
                    "recommend_courses": [course.to_json() for course in courses]

                })


@main.route('/api/recommend/text-resources/<int:type_id>')
@user_login_info
def recommend_text_resources(type_id):
    """
    推荐方式:未登录采用热度推荐,登录但是行为很少采用冷启动推荐,登录数据多采用算法(用户相似或者文本资源相似)推荐
    :param: type_id(采用的推荐算法的类型)
    :return: course(json)
    """
    user = g.current_user
    if user is None:
        resources = popular_text_resource()
        return jsonify({
            "count": len(resources),
            "recommend_text_resources": [t_resource[0].to_json() for t_resource in resources]
        })
    else:
        user_behaviors = TextResourceBehavior.query.filter_by(user_id=user.id).all()
        if len(user_behaviors) == 0:   # 当用户行为的数量少于X时, 由于数据量少计算没有意义 因为根据用户兴趣标签来进行推荐
            print 'code start calc start'
            resources = code_start_text_resource(user)
            return jsonify({
                "count": len(resources),
                "recommend_text_resources": [t_resource[0].to_json() for t_resource in resources]
            })
        else:
            if type_id == 0:
                print "t_resources user similarity start"
                text_resources = text_resources_user_recommend(user, 10, 3)
                return jsonify({
                    "count": len(text_resources),
                    "text_resources_recommend": [t_resource.to_json() for t_resource in text_resources]
                })
            else:
                print "t_resources_similarity start"
                text_resources = text_resources_recommend(user, 10, 3)
                return jsonify({
                    "count": len(text_resources),
                    "text_resources_recommend": [t_resource.to_json() for t_resource in text_resources]
                })


@main.route('/api/recommend/tests/<int:type_id>')
@user_login_info
def recommend_test(type_id):

    """
    推荐方式:未登录采用热度推荐,登录但是行为很少采用冷启动推荐,登录数据多采用算法(用户相似或者课程相似)推荐
    :param: type_id(采用的推荐算法的类型)
    :return: course(json)
    """
    user = g.current_user
    if user is None:
        all_test = popular_test()
        return jsonify({
            "count": len(all_test),
            "recommend_tests": [test[0].to_json() for test in all_test]
        })
    else:
        user_behaviors = CourseBehavior.query.filter_by(user_id=user.id).all()
        if len(user_behaviors) == 0:   # 当用户行为的数量少于X时, 由于数据量少计算没有意义 因为根据用户兴趣标签来进行推荐
            print 'code start calc start'
            all_test = code_start_test(user)
            return jsonify({
                "count": len(all_test),
                "recommend_tests": [test[0].to_json() for test in all_test]
            })
        else:
            if type_id == 0:
                print "test user similarity start"
                all_tests = test_user_similarity_recommend(user, 10, 3)
                return jsonify({
                    "count": len(all_tests),
                    "recommend_tests": [test.to_json() for test in all_tests]

                })
            else:
                print "test similarity start"
                all_tests = test_similarity_recommend(user, 10, 3)
                return jsonify({
                    "count": len(all_tests),
                    "recommend_tests": [test.to_json() for test in all_tests]

                })

