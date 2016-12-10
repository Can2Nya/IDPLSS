# coding: utf-8
from flask import request, g, url_for, current_app, jsonify

from app.main import main
from app.utils.responses import self_response
from app.utils.model_tools import have_school_permission
from app.main.responses import bad_request, not_found, forbidden
from app.main.decorators import permission_required, login_required, user_login_info
from app.models import db, User, TextResource, TextResourceComment, Permission, TextResourceBehavior


@main.route('/api/text-resources', methods=['GET'])
def text_resources():
    page = request.args.get('page', 1, type=int)
    pagination = TextResource.query.filter_by(show=True).order_by(TextResource.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_text_resource = pagination.items
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.text_resources', page=page-1, _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.text_resources', page=page+1, _external=True)
    return jsonify({'text_resources': [text_resource.to_json() for text_resource in all_text_resource],
                    'prev': prev_url,
                    'next': next_url,
                    'count': pagination.total
                    })


@main.route('/api/text-resources/category/<int:cate_id>', methods=['GET'])
def text_resources_category(cate_id):
    page = request.args.get('page', 1, type=int)
    pagination = TextResource.query.\
        filter_by(resource_category=cate_id, show=True).order_by(TextResource.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_text_resource = pagination.items
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.text_resources_category', page=page-1, cate_id=cate_id,  _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.text_resources_category', page=page+1, cate_id=cate_id,  _external=True)
    return jsonify({'text_resources': [text_resource.to_json() for text_resource in all_text_resource],
                    'prev': prev_url,
                    'next': next_url,
                    'count': pagination.total
                    })


@main.route('/api/text-resources/category/<int:cate_id>/type/<int:tid>', methods=['GET'])
def text_resources_category_type(cate_id, tid):
    page = request.args.get('page', 1, type=int)
    pagination = TextResource.query.filter_by(resource_category=cate_id, resource_type=tid, show=True).\
        order_by(TextResource.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_text_resource = pagination.items
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.text_resources_category_type', page=page-1, cate_id=cate_id, tid=tid, _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.text_resources_category_type', page=page+1, cate_id=cate_id, tid=tid, _external=True)
    return jsonify({'text_resources': [text_resource.to_json() for text_resource in all_text_resource],
                    'prev': prev_url,
                    'next': next_url,
                    'count': pagination.total
                    })


@main.route('/api/text-resources/<int:rid>', methods=['GET', 'DELETE', 'PUT'])
@user_login_info
def text_resource_detail(rid):
    user = g.current_user
    text_resource = TextResource.query.get_or_404(rid)
    if request.method == 'GET':
        if text_resource.show is not False:
            return jsonify(text_resource.to_json())
        else:
            return not_found()
    elif request.method == 'DELETE':
        if not user or not (user.id == text_resource.author_id or have_school_permission(user)):
            return forbidden('does not have permissions')
        text_resource.show = False
        all_users = User.query.all()
        for u in all_users:   # 删除用户收藏的课程
            if u.is_collecting_text_resouurce(text_resource):
                u.collection_text_resource.remove(text_resource)
        all_behaviors = TextResourceBehavior.query.filter_by(text_resource_id=text_resource.id).all()
        if all_behaviors is not None:
            for b in all_behaviors:
                db.session.delete(b)
        db.session.add(text_resource)
        db.session.commit()
        return self_response('delete text resource successfully')
    elif request.method == 'PUT':
        if not user or not (user.id == text_resource.author_id or have_school_permission(user)):
            return forbidden('does not have permissions')
        modify_info = request.json
        text_resource.resource_name = modify_info['resource_name']
        text_resource.description = modify_info['description']
        text_resource.resource_category = modify_info['category']
        text_resource.resource_type = modify_info['type']
        text_resource.source_url = modify_info['source_url']
        db.session.add(text_resource)
        db.session.commit()
        return self_response('update text resource information successfully')
    else:
        return self_response('invalid operation')


@main.route('/api/text-resources/new-resource', methods=['POST'])
@login_required
@permission_required(Permission.UPLOAD_RESOURCE)
def new_text_resource():
    text_resource = TextResource.from_json(request.json)
    db.session.add(text_resource)
    db.session.commit()
    return self_response('upload text resource successfully')


@main.route('/api/text-resources/<int:rid>/comments')
def text_resource_comments(rid):
    page = request.args.get('page', 1, type=int)
    pagination = TextResourceComment.query.filter_by(text_resource_id=rid, show=True).\
        order_by(TextResourceComment.timestamp.desc()).paginate(
        page, per_page=current_app.config['IDPLSS_COMMENTS_PER_PAGE'],
        error_out=False
    )
    all_comments = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.text_resource_comments', rid=rid, page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.text_resource_comments', rid=rid, page=page+1, _external=True)
    return jsonify({
        'comments': [comment.to_json() for comment in all_comments],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })


@main.route('/api/text-resources/<int:rid>/new-comment', methods=['POST'])
@login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def publish_resource_comment(rid):
    comment = TextResourceComment.from_json(request.json)
    db.session.add(comment)
    db.session.commit()
    return self_response('publish comment successfully')


@main.route('/api/text-resources/comment/<int:rid>', methods=['DELETE'])
@login_required
@permission_required(Permission.DELETE_RESOURCE)
def delete_resource_comment(rid):
    comment = TextResourceComment.query.get_or_404(rid)
    comment.show = False
    db.session.add(comment)
    db.session.commit()
    return self_response('delete comment successfully')


@main.route('/api/text-resources/<int:rid>/is-collecting')
@login_required
def is_collecting_resource(rid):
    text_resource = TextResource.query.get_or_404(rid)
    user = g.current_user
    if user.is_collecting_text_resouurce(text_resource):
        return self_response('True')
    else:
        return self_response('False')


@main.route('/api/text-resources/<int:rid>/collect-resource', methods=['GET', 'DELETE'])
@login_required
@permission_required(Permission.COMMENT_FOLLOW_COLLECT)
def collect_resource(rid):
    text_resource = TextResource.query.get_or_404(rid)
    user = g.current_user
    behavior = TextResourceBehavior.query.filter_by(user_id=user.id, text_resource_id=text_resource.id).first()
    if request.method == 'GET':
        user.collect_text_resouce(text_resource)
        text_resource.download_sum += 1
        db.session.add(text_resource)
        if behavior is None:
            record = TextResourceBehavior(user_id=user.id, text_resource_id=text_resource.id, is_collect=True)
            db.session.add(record)
        else:
            behavior.is_collect = True
            db.session.add(behavior)
        db.session.commit()
        return self_response('collect text resource successfully')
    elif request.method == 'DELETE':
        if user.is_collecting_text_resouurce(text_resource):
            user.uncollect_text_resource(text_resource)
            text_resource.download_sum -= 1
            db.session.add(text_resource)
            db.session.commit()
            if behavior is not None:
                behavior.is_collect = False
                db.session.add(behavior)
                db.sessionc.commit()
            return self_response('unfavorite text resource successfully')
        else:
            return bad_request('user does not collect text resource ago')
    else:
        return self_response('invalid operation')


@main.route('/api/text-resources/search', methods=['POST'])
def search_text_resource():
    search_info = request.json
    key_word = search_info['key_words']
    page = request.args.get('page', 1, type=int)
    pagination = TextResource.query.\
        filter(TextResource.resource_name.like('%'+key_word+'%'), TextResource.show == True).paginate(
        page, per_page=current_app.config['IDPLSS_POSTS_PER_PAGE'],
        error_out=False
    )
    all_resources = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.search_text_resource', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.search_text_resource', page=page+1, _external=True)
    return jsonify({
        'search_result': [t_resource.to_json() for t_resource in all_resources],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })


@main.route('/api/text-resources/like/<int:tid>', methods=['GET'])
@user_login_info
def like_text_resource(tid):
    t_resource = TextResource.query.get_or_404(tid)
    t_resource.like += 1
    db.session.add(t_resource)
    user = g.current_user
    if user is None:
        db.session.commit()
        return self_response('guest like text resource successfully')
    else:
        behavior = TextResourceBehavior.query.filter_by(user_id=user.id, text_resource_id=t_resource.id).first()
        if behavior is None:
            record = TextResourceBehavior(user_id=user.id, text_resource_id=t_resource.id, is_like=True)
            db.session.add(record)
        else:
            behavior.is_like = True
            db.session.add(behavior)
        db.session.commit()
        return self_response('like text_resource successfully')


