# codint: utf-8
from flask import g, request, url_for, current_app, jsonify
from app.models import CourseVideo, VideoComment, collectionVideos, db, Permission, User
from app.main.responses import forbidden, not_found
from app.utils.responses import self_response
from app.main.decorators import get_current_user, permission_required, admin_required
from app.main import main
from app.main.authentication import auth


@main.route('/api/courses-video', methods=['GET'])
def courses_video():
    page = request.args.get('page', 1, type=int)
    pagination = CourseVideo.query.order_by(CourseVideo.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_courses_video = pagination.items
    count = 0
    for video in all_courses_video:
        if video.show is not False:
            count = count+1
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.courses_video', page=page-1, _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.courses_video', page=page+1, _external=True)
    return jsonify({'courses_video': [video.to_json() for video in all_courses_video if video.show is not False],
                    'prev': prev_url,
                    'next': next_url,
                    'count': count

                    })


@main.route('/api/courses-video/category/<int:cate_id>', methods=['GET'])
def courses_video_category(cate_id):
    page = request.args.get('page', 1, type=int)
    pagination = CourseVideo.query.filter_by(video_category=cate_id).order_by(CourseVideo.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_courses_video = pagination.items
    count = 0
    for video in all_courses_video:
        if video.show is not False:
            count = count+1
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.courses_video_category', page=page-1, cate_id=cate_id,  _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.courses_video_category', page=page+1, cate_id=cate_id,  _external=True)
    return jsonify({'courses_video': [video.to_json() for video in all_courses_video],
                    'prev': prev_url,
                    'next': next_url,
                    'count': count

                    })


@main.route('/api/courses-video/<int:vid>', methods=['GET', 'DELETE'])
def course_video_detail(vid):
    if request.method == 'GET':
        course_video = CourseVideo.query.get_or_404(vid)
        return jsonify(course_video.to_json())
    if request.method == 'DELETE':
        course_video = CourseVideo.query.get_or_404(vid)
        course_video.show = False
        db.session.add(course_video)
        db.session.commit()
        return self_response('delete course video successfully')
    else:
        return self_response('invalid operation')


@main.route('/api/courses-video/new-video', methods=['POST'])
@auth.login_required
@permission_required(Permission.UPLOAD_VIDEO)
@get_current_user
def upload_video():
    course_video_info = request.json
    new_course_video = CourseVideo.from_json(course_video_info)
    db.session.add(new_course_video)
    db.session.commit()
    return self_response('upload course video successfully')


@main.route('/api/courses-video/<int:vid>/comments', methods=['GET'])
def courses_video_comments(vid):
    page = request.args.get('page', 1, type=int)
    pagination = VideoComment.query.filter_by(video_id=vid).order_by(VideoComment.timestamp.desc()).paginate(
        page, per_page=current_app.config['IDPLSS_COMMENTS_PER_PAGE'],
        error_out=False
    )
    all_comments = pagination.items
    count = 0
    for comment in all_comments:
        if comment.show is not False:
            count = count+1
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.courses_video_comments', vid=vid, page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.courses_video_comments', vid=vid, page=page+1, _external=True)
    return jsonify({
        'posts': [comment.to_json() for comment in all_comments if comment.show is not False],
        'prev': url_prev,
        'next': url_next,
        'count': count
    })


@main.route('/api/courses-video/<int:vid>/new-comment', methods=['POST'])
@auth.login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def publish_video_comment(vid):
    video_comment = VideoComment.from_json(request.json)
    db.session.add(video_comment)
    db.session.commit()
    return self_response('publish comment successfully')


@main.route('/api/courses-video/comment/<int:cid>', methods=['DELETE'])
@auth.login_required
@permission_required(Permission.DELETE_VIDEO)
def delete_video_comment(cid):
    video_comment = VideoComment.query.get_or_404(cid)
    video_comment.show = False
    db.session.add(video_comment)
    db.session.commit()
    return self_response('delete video comment successfully')


@main.route('/api/courses-video/<int:vid>/is-collecting', methods=['GET'])
@auth.login_required
@get_current_user
def is_collecting_video(vid):
    course_video = CourseVideo.query.get_or_404(vid)
    user = g.current_user
    if user.is_collecting_video(course_video):
        return self_response('True')
    else:
        return self_response('False')


@main.route('/api/courses-video/<int:vid>/collect-video', methods=['GET', 'DELETE'])
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def collect_course_video(vid):
    course_video = CourseVideo.query.get_or_404(vid)
    user = g.current_user
    if request.method == 'GET':
        user.collect_video(course_video)
        return self_response('collect video successfully')
    elif request.method == 'DELETE':
        user.uncollect_video(course_video)
        return self_response('unfavorite video successfully')
    else:
        return self_response('invalid operation')







