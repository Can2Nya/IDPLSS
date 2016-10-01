# coding: utf-8
from flask import request, g, url_for, current_app, jsonify
from app.models import db, User, TextResource, TextResourceComment, Permission
from app.main.decorators import permission_required, get_current_user
from app.main.authentication import auth
from app.main import main
from app.main.responses import bad_request, not_found, forbidden
from app.utils.responses import self_response


@main.route('/api/text-resources', methods=['GET'])
def text_resources():
    page = request.args.get('page', 1, type=int)
    pagination = TextResource.query.order_by(TextResource.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_text_resource = pagination.items
    count = 0
    for t_resource in all_text_resource:
        if t_resource.show is not False:
            count = count +1
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.text_resources', page=page-1, _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.text_resources', page=page+1, _external=True)
    return jsonify({'text_resources': [text_resource.to_json() for text_resource in all_text_resource
                                       if text_resource.show is not False],
                    'prev': prev_url,
                    'next': next_url,
                    'count': count
                    })


@main.route('/api/text-resources/category/<int:cate_id>', methods=['GET'])
def text_resources_category(cate_id):
    page = request.args.get('page', 1, type=int)
    pagination = TextResource.query.filter_by(resource_category=cate_id).order_by(TextResource.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_text_resource = pagination.items
    count = 0
    for t_resource in all_text_resource:
        if t_resource.show is not False:
            count = count+1
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.text_resources_category', page=page-1, cate_id=cate_id,  _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.text_resources_category', page=page+1, cate_id=cate_id,  _external=True)
    return jsonify({'text_resources': [text_resource.to_json() for text_resource in all_text_resource
                                       if text_resource.show is not False],
                    'prev': prev_url,
                    'next': next_url,
                    'count': count
                    })


@main.route('/api/text-resources/category/<int:cate_id>/type/<int:tid>', methods=['GET'])
def text_resources_category_type(cate_id, tid):
    page = request.args.get('page', 1, type=int)
    pagination = TextResource.query.filter_by(resource_category=cate_id, resource_type=tid).order_by(TextResource.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_text_resource = pagination.items
    count = 0
    for t_resource in all_text_resource:
        if t_resource.show is not False:
            count = count+1
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.text_resources_category_type', page=page-1, cate_id=cate_id, tid=tid, _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.text_resources_category_type', page=page+1, cate_id=cate_id, tid=tid, _external=True)
    return jsonify({'text_resources': [text_resource.to_json() for text_resource in all_text_resource
                                       if text_resource.show is not False],
                    'prev': prev_url,
                    'next': next_url,
                    'count': count
                    })


@main.route('/api/text-resources/<int:rid>', methods=['GET', 'DELETE'])
def text_resource_detail(rid):
    text_resource = TextResource.query.get_or_404(rid)
    if request.method == 'GET':
        if text_resource.show is not False:
            return jsonify(text_resource.to_json())
        else:
            return not_found()
    elif request.method == 'DELETE':
        text_resource.show = False
        db.session.add(text_resource)
        db.session.commit()
        return self_response('delete text resource successfully')
    else:
        return self_response('invalid operation')


@main.route('/api/text-resources/new-resource', methods=['POST'])
@auth.login_required
@permission_required(Permission.UPLOAD_RESOURCE)
def new_text_resource():
    text_resource = TextResource.from_json(request.json)
    db.session.add(text_resource)
    db.session.commit()
    return self_response('upload text resource successfully')


@main.route('/api/text-resources/<int:rid>/comments')
def text_resource_comments(rid):
    page = request.args.get('page', 1, type=int)
    pagination = TextResourceComment.query.filter_by(text_resource_id=rid).order_by(TextResourceComment.timestamp.desc()).paginate(
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
        url_prev = url_for('main.text_resource_comments', rid=rid, page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.text_resource_comments', rid=rid, page=page+1, _external=True)
    return jsonify({
        'posts': [comment.to_json() for comment in all_comments if comment.show is not False],
        'prev': url_prev,
        'next': url_next,
        'count': count
    })


@main.route('/api/text-resources/<int:rid>/new-comment', methods=['POST'])
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def publish_resource_comment(rid):
    comment = TextResourceComment.from_json(request.json)
    db.session.add(comment)
    db.session.commit()
    return self_response('publish comment successfully')


@main.route('/api/text-resources/comment/<int:rid>', methods=['DELETE'])
@auth.login_required
@permission_required(Permission.DELETE_RESOURCE)
def delete_resource_comment(rid):
    comment = TextResourceComment.query.get_or_404(rid)
    comment.show = False
    db.session.add(comment)
    db.session.commit()
    return self_response('delete comment successfully')


@main.route('/api/text-resources/<int:rid>/is-collecting')
@get_current_user
@auth.login_required
def is_collecting_resource(rid):
    text_resource = TextResource.query.get_or_404(rid)
    user = g.current_user
    if user.is_collecting_text_resouurce(text_resource):
        return self_response('True')
    else:
        return self_response('False')


@main.route('/api/text-resources/<int:rid>/collect-resource', methods=['GET', 'DELETE'])
@auth.login_required
@get_current_user
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def collect_resource(rid):
    text_resource = TextResource.query.get_or_404(rid)
    user = g.current_user
    if request.method == 'GET':
       user.collect_text_resouce(text_resource)
       return self_response('collect text resource successfully')
    elif request.method == 'DELETE':
        user.uncollect_text_resource(text_resource)
        return self_response('unfavorite text resource successfully')
    else:
        return self_response('invalid operation')
