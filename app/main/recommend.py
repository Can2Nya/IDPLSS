# coding:utf-8
from flask import jsonify, g
from app.main import main
from app.main.decorators import user_login_info
from app.models import User, Course, TextResource, TestList, CourseBehavior, TextResourceBehavior, TestBehavior
from app.recommend.code_start import code_start_course, code_start_text_resource, code_start_test
from app.recommend.course_recommend import course_similarity_calc, user_similarity_calc
from app.recommend.popular_recommend import popular_course, popular_text_resource, popular_test


@main.route('/api/recommend/courses')
@user_login_info
def recommend_course():
    user = g.current_user
    if user is None:
        courses = popular_course()
        return jsonify({
            "count": len(courses),
            "recommend_courses": [course.to_json() for course in courses]
        })
    else:
        return jsonify({
            "status": "error"
        })


@main.route('/api/recommend/text-resources')
@user_login_info
def recommend_text_resources():
    user = g.current_user
    if user is None:
        pass
    else:
        pass


@main.route('/api/recommend/test')
@user_login_info
def recommend_test():
    user = g.current_user
    if user is None:
        pass
    else:
        pass

