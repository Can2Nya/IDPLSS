# coding:utf-8
from flask import jsonify, g
from app.main import main
from app.main.decorators import user_login_info
from app.models import User, Course, TextResource, TestList, CourseBehavior, TextResourceBehavior, TestBehavior
from app.recommend.code_start import code_start_course, code_start_text_resource, code_start_test
from app.recommend.course_recommend import user_similarity_recommend, course_similarity_recommend
from app.recommend.popular_recommend import popular_course, popular_text_resource, popular_test


@main.route('/api/recommend/courses')
@user_login_info
def recommend_course():
    """
    推荐方式:未登录采用热度推荐,登录但是行为很少采用冷启动推荐,登录数据多采用算法(用户相似或者课程相似)推荐
    :param: type(采用的推荐算法的类型
    :return: course(json)
    """
    calc_type = "user"
    user = g.current_user
    if user is None:
        courses = popular_course()
        return jsonify({
            "count": len(courses),
            "recommend_courses": [course[0].to_json() for course in courses]
        })
    else:
        user_behaviors = CourseBehavior.query.filter_by(user_id=user.id).all()
        if len(user_behaviors) < 20:   # 当用户行为的数量少于X时, 由于数据量少计算没有意义 因为根据用户兴趣标签来进行推荐
            print 'code start calc start'
            courses = code_start_course(user)
            return jsonify({
                "count": len(courses),
                "recommend_courses": [course[0].to_json() for course in courses]
            })
        else:
            if calc_type == "user":
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
    """
    推荐方式:未登录采用热度推荐,登录但是行为很少采用冷启动推荐,登录数据多采用算法(用户相似或者课程相似)推荐
    :param: type(采用的推荐算法的类型
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
        if len(user_behaviors) < 20:   # 当用户行为的数量少于X时, 由于数据量少计算没有意义 因为根据用户兴趣标签来进行推荐
            print 'code start calc start'
            resources = code_start_text_resource(user)
            return jsonify({
                "count": len(resources),
                "recommend_text_resources": [t_resource[0].to_json() for t_resource in resources]
            })
        else:
            if type == "user":
                print "user similarity start"
                resources = user_similarity_recommend(user, 10, 3)
                return jsonify({
                    "count": len(resources),
                    "recommend_text_courses": [t_resource.to_json() for t_resource in resources]

                })
            else:
                print "t_resources_similarity start"
                courses = course_similarity_recommend(user, 10, 3)
                print courses
                return jsonify({
                    "count": "successfully"
                })


@main.route('/api/recommend/test')
@user_login_info
def recommend_test():

    """
    推荐方式:未登录采用热度推荐,登录但是行为很少采用冷启动推荐,登录数据多采用算法(用户相似或者课程相似)推荐
    :param: type(采用的推荐算法的类型
    :return: course(json)
    """
    user = g.current_user
    if user is None:
        all_test = popular_test()
        return jsonify({
            "count": len(all_test),
            "recommend_test": [test[0].to_json() for test in all_test]
        })
    else:
        user_behaviors = CourseBehavior.query.filter_by(user_id=user.id).all()
        if len(user_behaviors) < 20:   # 当用户行为的数量少于X时, 由于数据量少计算没有意义 因为根据用户兴趣标签来进行推荐
            print 'code start calc start'
            all_test = code_start_test(user)
            return jsonify({
                "count": len(all_test),
                "recommend_test": [test[0].to_json() for test in all_test]
            })
        else:
            if type == "user":
                print "user similarity start"
                all_test = user_similarity_recommend(user, 10, 3)
                return jsonify({
                    "count": len(all_test),
                    "recommend_test": [test.to_json() for test in all_test]

                })
            else:
                print "test_similarity start"
                courses = course_similarity_recommend(user, 10, 3)
                print courses
                return jsonify({
                    "count": "successfully"
                })

