# -*- coding: utf-8 -*-
"""
    main.courses
    ~~~~~~~~~~~~

    处理课程板块API请求

"""

from flask import g, request, url_for, current_app, jsonify

from . import main
from .tasks import delete_related_chapter, delete_test
from ..utils import self_response, have_school_permission, logger
from .responses import forbidden, not_found, bad_request, method_not_allowed
from .decorators import login_required, permission_required, user_login_info
from ..models import CourseBehavior, Course, CourseComment, db, Permission, User, VideoList, \
    CourseChapter, CourseNode, CourseResource, TestList, AnswerRecord, TestRecord, TestBehavior


@main.route('/api/courses', methods=['GET'])
def courses():
    """
    获得所有课程
    :return: json
    """
    page = request.args.get('page', 1, type=int)
    pagination = Course.query.filter_by(show=True).order_by(Course.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_courses = pagination.items
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.courses', page=page-1, _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.courses', page=page+1, _external=True)
    return jsonify({'courses': [course.to_json() for course in all_courses],
                    'prev': prev_url,
                    'next': next_url,
                    'count': pagination.total
                    })


@main.route('/api/courses/detail/<int:cid>', methods=['GET', 'DELETE', 'PUT'])
@user_login_info
def course_operation(cid):
    course = Course.query.get_or_404(cid)
    user = g.current_user
    if request.method == 'GET':
        if course.show:
            return jsonify(course.to_json())
        else:
            return not_found()
    elif request.method == 'DELETE':
        if user is None or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permissions')
        course.show = False
        all_user = User.query.all()
        for u in all_user:
            if u.is_collecting_course(course):
                u.collection_courses.remove(course)
        all_behaviors = CourseBehavior.query.filter_by(course_id=course.id).all()
        if all_behaviors is not None:
            for b in all_behaviors:
                db.session.delete(b)
        db.session.add(course)
        db.session.commit()
        return self_response('delete course successfully')
    elif request.method == 'PUT':
        if user is None or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permissions')
        modify_info = request.json
        course.description = modify_info['description']
        course.course_name = modify_info['course_name']
        course.images = modify_info['image']
        course.course_category = modify_info['category']
        db.session.add(course)
        db.session.commit()
        return self_response('change course information successfully')
    else:
        return method_not_allowed('invalid operation')


@main.route('/api/courses/category/<int:cate_id>', methods=['GET'])
def courses_category(cate_id):
    page = request.args.get('page', 1, type=int)
    pagination = Course.query.filter_by(show=True, course_category=cate_id).order_by(Course.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_courses = pagination.items
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.courses_category', page=page-1, cate_id=cate_id,  _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.courses_category', page=page+1, cate_id=cate_id,  _external=True)
    return jsonify({'courses': [course.to_json() for course in all_courses],
                    'prev': prev_url,
                    'next': next_url,
                    'count': pagination.total

                    })


@main.route('/api/courses/<int:cid>/video-list', methods=['GET'])
def courses_video_list(cid):
    page = request.args.get('page', 1, type=int)
    pagination = VideoList.query.filter_by(course_id=cid, show=True).order_by(VideoList.video_order).paginate(
        page, per_page=current_app.config['IDPLSS_COMMENTS_PER_PAGE'],
        error_out=False
    )
    all_video = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.courses_video_list', cid=cid, page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.courses_video_list', cid=cid, page=page+1, _external=True)
    return jsonify({
        'video_list': [video.to_json() for video in all_video],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })


@main.route('/api/courses/<int:cid>/video/<int:vid>', methods=['GET', 'DELETE', 'PUT'])
@user_login_info
def course_video_detail(cid, vid):
    user = g.current_user
    course_video = VideoList.query.get_or_404(vid)
    if request.method == 'GET':
        course_video = VideoList.query.get_or_404(vid)
        if course_video.show is not False:
            return jsonify(course_video.to_json())
        else:
            return not_found()
    elif request.method == 'DELETE':
        if not user or not (user.id == course_video.author_id or have_school_permission(user)):
            return forbidden('does not have permissions')
        course_video.show = False
        db.session.add(course_video)
        db.session.commit()
        all_video = VideoList.query.filter_by(course_id=cid, show=True).order_by(VideoList.video_order).all()
        order = [x for x in range(1, len(all_video)+1)]
        for x, y in zip(all_video, order):
            x.video_order = y
            db.session.add(x)
        db.session.commit()
        return self_response('delete course video successfully')
    elif request.method == 'PUT':
        if not user or not (user.id == course_video.author_id or have_school_permission(user)):
            return forbidden('does not have permissions')
        modify_info = request.json
        course_video.video_description = modify_info['description']
        course_video.video_name = modify_info['name']
        course_video.source_url = modify_info['source_url']
        course_video.video_order = modify_info['video_order']
        db.session.add(course_video)
        db.session.commit()
        return self_response('update video information successfully')
    else:
        return self_response('invalid operation')


@main.route('/api/courses/new-course', methods=['POST'])
@login_required
@permission_required(Permission.UPLOAD_VIDEO)
def create_course():
    course_info = request.json
    new_course = Course.from_json(course_info)
    db.session.add(new_course)
    db.session.commit()
    return self_response('create course successfully')


@main.route('/api/courses/<int:cid>/new-video', methods=['POST'])
@login_required
@permission_required(Permission.UPLOAD_VIDEO)
def upload_video(cid):
    course_video_info = request.json
    new_course_video = VideoList.from_json(course_video_info)
    db.session.add(new_course_video)
    db.session.commit()
    return self_response('upload course video successfully')


@main.route('/api/courses/<int:cid>/comments', methods=['GET'])
def courses_comments(cid):
    page = request.args.get('page', 1, type=int)
    pagination = CourseComment.query.filter_by(course_id=cid, show=True).order_by(CourseComment.timestamp.desc()).paginate(
        page, per_page=current_app.config['IDPLSS_COMMENTS_PER_PAGE'],
        error_out=False
    )
    all_comments = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.courses_comments', cid=cid, page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.courses_comments', cid=cid, page=page+1, _external=True)
    return jsonify({
        'posts': [comment.to_json() for comment in all_comments],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })


@main.route('/api/courses/<int:cid>/new-comment', methods=['POST'])
@login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def publish_video_comment(cid):
    course_comment = CourseComment.from_json(request.json)
    db.session.add(course_comment)
    db.session.commit()
    return self_response('publish comment successfully')


@main.route('/api/courses/comment/<int:cid>', methods=['DELETE'])
@login_required
@permission_required(Permission.DELETE_VIDEO)
def delete_video_comment(cid):
    course_comment = CourseComment.query.get_or_404(cid)
    course_comment.show = False
    db.session.add(course_comment)
    db.session.commit()
    return self_response('delete coures comment successfully')


@main.route('/api/courses/<int:cid>/is-collecting', methods=['GET'])
@login_required
def is_collecting_video(cid):
    course = Course.query.get_or_404(cid)
    user = g.current_user
    if user.is_collecting_course(course):
        return self_response('True')
    else:
        return self_response('False')


@main.route('/api/courses/<int:vid>/collect-course', methods=['GET', 'DELETE'])
@login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def collect_course_video(vid):
    course = Course.query.get_or_404(vid)
    user = g.current_user
    behavior = CourseBehavior.query.filter_by(user_id=user.id, course_id=vid).first()
    if request.method == 'GET':
        user.collect_course(course)
        course.collect_sum += 1
        db.session.add(course)
        if behavior is None:
            record = CourseBehavior(user_id=user.id, course_id=vid, is_collect=True)
            db.session.add(record)
        else:
            behavior.is_collect = True
            db.session.add(behavior)
        db.session.commit()
        return self_response('collect course successfully')
    elif request.method == 'DELETE':
        if user.is_collecting_course(course):
            user.uncollect_course(course)
            course.collect_sum -= 1
            db.session.add(course)
            db.session.commit()
            if behavior is not None:
                behavior.is_collect = False
                db.session.add(behavior)
                db.session.commit()
            return self_response('unfavorite course successfully')
        else:
            return bad_request('user does not collect course ago')
    else:
        return method_not_allowed('invalid operation')


@main.route('/api/courses/search', methods=['POST'])
def search_course():
    search_info = request.json
    key_word = search_info['key_words']
    page = request.args.get('page', 1, type=int)
    pagination = Course.query.filter(Course.course_name.like('%'+key_word+'%'), Course.show == True).paginate(
        page, per_page=current_app.config['IDPLSS_POSTS_PER_PAGE'],
        error_out=False
    )
    all_courses = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.search_course', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.search_course', page=page+1, _external=True)
    return jsonify({
        'search_result': [course.to_json() for course in all_courses if course.show == True],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })


@main.route('/api/courses/like/<int:cid>', methods=['GET'])
@user_login_info
def like_course(cid):
    course = Course.query.get_or_404(cid)
    course.like += 1
    db.session.add(course)
    user = g.current_user
    if user is None:
        db.session.commit()
        return self_response("guest like successfully")
    else:
        course_behavior = CourseBehavior.query.filter_by(user_id=user.id, course_id=cid).first()
        if course_behavior is None:
            record = CourseBehavior(user_id=user.id, course_id=cid, is_like=True)
            db.session.add(record)
        else:
            course_behavior.is_like = True
            db.session.add(course_behavior)
        db.session.commit()
        return self_response("login user like successfully")


@main.route('/api/courses/<int:cid>/chapters', methods=['GET', 'POST', 'PUT','DELETE'])
@user_login_info
def course_chapters(cid):
    user = g.current_user
    course = Course.query.filter_by(id=cid, show=True).first()
    if not course:
        return not_found()
    if request.method == 'GET':
        chapters = CourseChapter.query.filter_by(course_id=cid, show=True).order_by(CourseChapter.chapter_order.asc()).all()
        return jsonify({
            'count': len(chapters),
            'chapters': [chapter.to_json() for chapter in chapters]
        })
    elif request.method == 'POST':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        chapter_info = request.json
        chapter_info['course_id'] = cid
        new_chapter = CourseChapter.from_json(chapter_info)
        db.session.add(new_chapter)
        db.session.commit()
        return self_response('create chapter successfully')
    elif request.method == 'PUT':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        chg_info = request.json
        chapter = CourseChapter.query.filter_by(id=chg_info['chapter_id'], show=True).first()
        if not chapter:
            return not_found()
        chapter.chapter_title = chg_info['title']
        db.session.add(chapter)
        db.session.commit()
        return self_response('update chapter information successfully')
    elif request.method == 'DELETE':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        chapter_info = request.json
        chapter = CourseChapter.query.filter_by(id=chapter_info['chapter_id'], show=True).first()
        if not chapter:
            return not_found()
        chapter.show = False
        db.session.add(chapter)
        db.session.commit()
        chapters = CourseChapter.query.filter_by(course_id=cid, show=True).order_by(CourseChapter.chapter_order.asc()).all()
        order_list = [x for x in range(1, len(chapters)+1)]
        for chapter, order in zip(chapters, order_list):
            chapter.chapter_order = order
            db.session.add(chapter)
        db.session.commit()
        delete_related_chapter.delay(chapter_info['chapter_id'])  # 异步删除与chapter相关的资料
        return self_response('delete chapter successfully')
    else:
        return method_not_allowed('invalid request')


@main.route('/api/courses/<int:cid>/chapter/<int:chapter_id>/node', methods=['GET', 'POST', 'PUT', 'DELETE'])
@user_login_info
def chapter_node(cid, chapter_id):
    user = g.current_user
    course = Course.query.get(cid)
    if not course:
        return not_found()
    if request.method == 'GET':
        nodes = CourseNode.query.filter_by(chapter_id=chapter_id, show=True).all()
        return jsonify({'count': len(nodes),
                        'nodes': [node.to_json() for node in nodes]})
    elif request.method == 'POST':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        info = request.json
        info['course_id'] = cid
        info['chapter_id'] = chapter_id
        new_node = CourseNode.from_json(info)
        db.session.add(new_node)
        db.session.commit()
        return self_response('create chapter node successfully')
    elif request.method == 'PUT':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        info = request.json
        node = CourseNode.query.filter_by(id=info['node_id'], show=True).first()
        if not node:
            return not_found()
        node.node_title = info['title']
        node.node_description = info['description']
        node.images = info['images']
        db.session.add(node)
        db.session.commit()
        return self_response('update node information successfully')
    elif request.method == 'DELETE':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        info = request.json
        node = CourseNode.query.filter_by(id=info['node_id'], show=True).first()
        if not node:
            return not_found()
        node.show = False
        db.session.add(node)
        db.session.commit()
        nodes = CourseNode.query.filter_by(course_id=cid, chapter_id=chapter_id, show=True).all()
        new_order = [x for x in range(1, len(nodes)+1)]
        for node, order in zip(nodes, new_order):
            node.node_order = order
            db.session.add(node)
        db.session.commit()
        return self_response('delete node successfully')
    else:
        return method_not_allowed('invalid request')


@main.route('/api/courses/<int:cid>/chapter/<int:chapter_id>/resource', methods=['GET', 'POST', 'PUT', 'DELETE'])
@user_login_info
def chapter_resource(cid, chapter_id):
    user = g.current_user
    course = Course.query.get(cid)
    if not course:
        return not_found()
    if request.method == 'GET':
        resources = CourseResource.query.filter_by(chapter_id=chapter_id, show=True).all()
        return jsonify({'count': len(resources),
                        'course_resources': [resource.to_json() for resource in resources]})
    elif request.method == 'POST':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        info = request.json
        info['chapter_id'] = chapter_id
        info['course_id'] = cid
        new_resource = CourseResource.from_json(info)
        db.session.add(new_resource)
        db.session.commit()
        return self_response('create chapter resource successfully')
    elif request.method == 'PUT':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        info = request.json

        resource = CourseResource.query.filter_by(id=info['resource_id'], show=True).first()
        if not resource:
            return not_found()
        logger.info("json info is {0} resource is {1}".format(info, resource))
        resource.resource_name = info['name']
        resource.resource_description = info['description']
        db.session.add(resource)
        db.session.commit()
        return self_response('update chapter resource successfully')
    elif request.method == 'DELETE':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        info = request.json
        resource = CourseResource.query.filter_by(id=info['resource_id'], show=True).first()
        if not resource:
            return not_found()
        resource.show = False
        db.session.add(resource)
        db.session.commit()
        return self_response('delete chapter resource successfully')
    else:
        return method_not_allowed('invalid request')


@main.route('/api/courses/<int:cid>/chapter/<int:chapter_id>/test', methods=['GET', 'POST', 'DELETE', 'PUT'])
@user_login_info
def chapter_test(cid, chapter_id):
    user = g.current_user
    course = Course.query.get(cid)
    if not course:
        return not_found()
    if request.method == 'GET':
        course_tests = TestList.query.filter_by(is_course_test=True, course_id=cid, chapter_id=chapter_id).all()
        if not course_tests:
            return not_found()
        return jsonify({
            'count': len(course_tests),
            'course_tests': [test.course_test_to_json() for test in course_tests]
        })
    elif request.method == 'POST':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        course_test_info = request.json
        course_test_info['is_course_test'] = True
        course_test_info['course_id'] = cid
        course_test_info['chapter_id'] = chapter_id
        new_test = TestList.course_test_from_json(course_test_info)
        db.session.add(new_test)
        db.session.commit()
        return self_response('create course test successfully')
    elif request.method == 'DELETE':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permissions')
        info = request.json
        test = TestList.query.filter_by(id=info['course_test_id']).first()
        if not test:
            return not_found()
        test.show = False
        db.session.add(test)
        db.session.commit()
        delete_test.delay(test.id)  # 异步删除与测试相关的资料
        return self_response('delete course test successfully')
    elif request.method == 'PUT':
        if not user or not (user.id == course.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        info = request.json
        test = TestList.query.filter_by(id=info['course_test_id']).first()
        if not test:
            return not_found()
        modify_info = request.json
        test.test_title = modify_info['title']
        test.test_description = modify_info['description']
        test.key_words = modify_info['key_words']
        test.image = modify_info['image']
        db.session.add(test)
        db.session.commit()
        return self_response('update course test information successfully')
    else:
        return method_not_allowed('invalid request')









