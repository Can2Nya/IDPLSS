# codint: utf-8
from flask import g, request, url_for, current_app, jsonify
from app.models import Course, CourseComment, VideoList, db, Permission, collectionCourses, CourseBehavior
from app.main.responses import forbidden, not_found, bad_request
from app.utils.responses import self_response
from app.utils.model_tools import calc_count
from app.main.decorators import get_current_user, permission_required, user_login_info
from app.main import main
from app.main.authentication import auth


@main.route('/api/courses', methods=['GET'])
def courses():
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


@main.route('/api/courses/detail/<int:cid>', methods=['GET', 'DELETE'])
def course_operation(cid):
    course = Course.query.get_or_404(cid)
    if request.method == 'GET':
        if course.show is not False:
            return jsonify(course.to_json())
        else:
            return not_found()
    elif request.method == 'DELETE':
        course.show = False
        db.session.add(course)
        db.session.commit()
        return self_response('delete course successfully')
    else:
        return self_response('invalid operation')


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


@main.route('/api/courses/<int:cid>/video/<int:vid>', methods=['GET', 'DELETE'])
def course_video_detail(cid, vid):
    if request.method == 'GET':
        course_video = VideoList.query.get_or_404(vid)
        if course_video.show is not False:
            return jsonify(course_video.to_json())
        else:
            return not_found()
    if request.method == 'DELETE':
        course_video = VideoList.query.get_or_404(vid)
        course_video.show = False
        db.session.add(course_video)
        db.session.commit()
        return self_response('delete course video successfully')
    else:
        return self_response('invalid operation')


@main.route('/api/courses/new-course', methods=['POST'])
@auth.login_required
@permission_required(Permission.UPLOAD_VIDEO)
@get_current_user
def create_course():
    course_info = request.json
    new_course = Course.from_json(course_info)
    db.session.add(new_course)
    db.session.commit()
    return self_response('create course successfully')


@main.route('/api/courses/<int:cid>/new-video', methods=['POST'])
@auth.login_required
@permission_required(Permission.UPLOAD_VIDEO)
@get_current_user
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
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def publish_video_comment(cid):
    course_comment = CourseComment.from_json(request.json)
    db.session.add(course_comment)
    db.session.commit()
    return self_response('publish comment successfully')


@main.route('/api/courses/comment/<int:cid>', methods=['DELETE'])
@auth.login_required
@permission_required(Permission.DELETE_VIDEO)
def delete_video_comment(cid):
    course_comment = CourseComment.query.get_or_404(cid)
    course_comment.show = False
    db.session.add(course_comment)
    db.session.commit()
    return self_response('delete coures comment successfully')


@main.route('/api/courses/<int:cid>/is-collecting', methods=['GET'])
@auth.login_required
@get_current_user
def is_collecting_video(cid):
    course = Course.query.get_or_404(cid)
    user = g.current_user
    if user.is_collecting_course(course):
        return self_response('True')
    else:
        return self_response('False')


@main.route('/api/courses/<int:vid>/collect-course', methods=['GET', 'DELETE'])
@auth.login_required
@get_current_user
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
        return self_response('invalid operation')


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
        'search_result': [course.to_json() for course in all_courses],
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







