# coding:utf-8
from flask import jsonify, g
from app.main import main
from app.main.decorators import user_login_info
from app.models import User, Course, TextResource, TestList, CourseBehavior, TextResourceBehavior, TestBehavior
from app.recommend.code_start import code_start_course, code_start_text_resource, code_start_test
from app.recommend.course_recommend import user_similarity_recommend, course_similarity_recommend
from app.recommend.popular_recommend import popular_course, popular_text_resource, popular_test


@main.route('/api/recommend/courses/<string:type>')
@user_login_info
def recommend_course(type):
    """
    推荐方式:未登录采用热度推荐,登录但是行为很少采用冷启动推荐,登录数据多采用算法(用户相似或者课程相似)推荐
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
        if len(user_behaviors) == 0:
            courses = code_start_course(user)
            return jsonify({
                "count": len(courses),
                "recommend_courses": [course[0].to_json() for course in courses]
            })
        else:
            if type == "user":
                print "user similarity start"
                courses = user_similarity_recommend(user, 10, 3)
                return jsonify({
                    "count": len(courses),
                    "recommend_courses": [course.to_json() for course in courses]

                })
            else:
                print "courses_similarity start"
                courses = course_similarity_recommend(user, 10, 3)
                print courses
                return jsonify({
                    "count": "successfully"
                })


@main.route('/api/recommend/text-resources')
@user_login_info
def recommend_text_resources():
    user = g.current_user
    if user is None:
        resources = popular_text_resource()
        return jsonify({
            "count": len(resources),
            "recommend_text_resources": [t_resource[0].to_json() for t_resource in resources]
        })
    else:
        pass


@main.route('/api/recommend/test')
@user_login_info
def recommend_test():
    user = g.current_user
    if user is None:
        test_list = popular_test()
        return jsonify({
            "count": len(test_list),
            "recommend_test": [test[0].to_json() for test in test_list]
        })
    else:
        pass

