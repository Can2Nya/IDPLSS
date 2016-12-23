# -*- coding: utf-8 -*-
"""
    main.online_test
    ~~~~~~~~~~~~

    处理用户测试API请求

"""

from flask import current_app, jsonify, g, request, url_for

from . import main
from .tasks import delete_test
from ..utils import self_response, have_school_permission
from .responses import not_found, forbidden, method_not_allowed
from .decorators import login_required, user_login_info
from ..models import TestList, TestRecord, TestProblem, TestBehavior, AnswerRecord, User, db


@main.route('/api/test-list', methods=['GET'])
def test_list():
    page = request.args.get('page', 1, type=int)
    pagination = TestList.query.filter_by(show=True, is_course_test=False).order_by(TestList.timestamp.desc()).paginate(
        page, per_page=current_app.config["IDPLSS_POSTS_PER_PAGE"],
        error_out=False
    )
    all_test = pagination.items
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.test_list', page=page-1, _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.test_list', page=page+1, _external=True)
    return jsonify({'test_list': [test.to_json() for test in all_test],
                    'prev': prev_url,
                    'next': next_url,
                    'count': pagination.total
                    })


@main.route('/api/test-list/detail/<int:tid>', methods=['GET', 'DELETE', 'PUT'])
@user_login_info
def test_operation(tid):
    user = g.current_user
    test = TestList.query.get_or_404(tid)
    if request.method == 'GET':
        if test.show is not False:
            return jsonify(test.to_json())
        else:
            return not_found()
    elif request.method == 'DELETE':
        if not user or not (user.id == test.author_id or have_school_permission(user)):
            return forbidden('does not have permissions')
        test.show = False
        db.session.add(test)
        db.session.commit()
        delete_test(test.id)
        return self_response('delete test successfully')
    elif request.method == 'PUT':
        if not user or not (user.id == test.author_id or have_school_permission(user)):
            return forbidden('does not have permission')
        modify_info = request.json
        test.test_title = modify_info['title']
        test.test_description = modify_info['description']
        test.test_category = modify_info['category']
        test.key_words = modify_info['key_words']
        test.image = modify_info['image']
        db.session.add(test)
        db.session.commit()
        return self_response('test information update successfully')
    else:
        return method_not_allowed('invalid request')


@main.route('/api/test-list/category/<int:cid>', methods=['GET'])
def test_list_category(cid):
    page = request.args.get('page', 1, type=int)
    pagination = TestList.query.filter_by(show=True, test_category=cid, is_course_test=False).order_by(TestList.timestamp.desc()).paginate(
        page, per_page=current_app.config['IDPLSS_POSTS_PER_PAGE'],
        error_out=False
    )
    all_test = pagination.items
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.test_list_category', cid=cid, page=page-1, _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.test_list_category', cid=cid, page=page+1, _external=True)
    return jsonify({
        'test_list': [test.to_json() for test in all_test],
        'prev': prev_url,
        'next': next_url,
        'count': pagination.total
    })


@main.route('/api/test-list/new-test', methods=['POST'])
def new_test():
    test_info = request.json
    test = TestList.from_json(test_info)
    db.session.add(test)
    db.session.commit()
    return self_response("create test successfully")


@main.route('/api/test-list/<int:tid>/problems', methods=['GET'])
def test_problems(tid):
    page = request.args.get('page', 1, type=int)
    pagination = TestProblem.query.filter_by(test_list_id=tid, show=True).order_by(TestProblem.problem_order).paginate(
        page, per_page=current_app.config['IDPLSS_COMMENTS_PER_PAGE'],
        error_out=False
    )
    all_problems = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.test_problems', tid=tid, page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.test_problems', tid=tid, page=page+1, _external=True)
    return jsonify({
        'problem_list': [problem.to_json() for problem in all_problems],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })


@main.route('/api/test-list/<int:tid>/new-problem', methods=['POST'])
@login_required
def new_problem(tid):
    problem = TestProblem.from_json(request.json)
    db.session.add(problem)
    db.session.commit()
    return self_response('add problem successfully')


@main.route('/api/test-list/<int:tid>/problems/<int:pid>', methods=['GET', 'DELETE', 'PUT'])
@user_login_info
def problem_operation(tid, pid):
    problem = TestProblem.query.get_or_404(pid)
    user = g.current_user
    if request.method == 'GET':
        if problem.show is not False:
            return jsonify(problem.to_json())
        else:
            return not_found()
    elif request.method == 'DELETE':
        if not user or not (user.id == problem.author_id or have_school_permission(user)):
            return forbidden('does not have permissions')
        problem.show = False
        db.session.add(problem)
        db.session.commit()
        all_problem = TestProblem.query.filter_by(test_list_id=tid, show=True).order_by(TestProblem.problem_order).all()
        problem_count = [x for x in range(1, len(all_problem)+1)]
        for x, y in zip(all_problem, problem_count):
            x.problem_order = y
            db.session.add(x)
        db.session.commit()
        return self_response('delete problem successfully')
    elif request.method == 'PUT':
        if not user or not (user.id == problem.author_id or have_school_permission(user)):
            return forbidden('does not have permissions')
        modify_info = request.json
        problem.right_answer = modify_info['right_answer']
        problem.choice_a = modify_info['choice_a']
        problem.choice_b = modify_info['choice_b']
        problem.choice_c = modify_info['choice_c']
        problem.choice_d = modify_info['choice_d']
        problem.problem_description = modify_info['problem_description']
        problem.description_image = modify_info['description_image']
        problem.problem_type = modify_info['problem_type']
        problem.problem_order = modify_info['problem_order']
        problem.answer_explain = modify_info['answer_explain']
        db.session.add(problem)
        db.session.commit()
        return self_response("update problem info successfully")
    else:
        return method_not_allowed('invalid request')


@main.route('/api/test-list/new-test-record', methods=['POST'])
@login_required
def new_test_record():
    """
    记录用户已经参与的测试列表,对应前端类似于"开始测试"按钮
    :return: json格式 返回请求状态:test_id
    """
    user = g.current_user
    record_info = request.json
    db_record = TestRecord.query.filter_by(answerer_id=record_info['answerer_id'], test_list_id=record_info['test_id']).first()
    if db_record is None:
        test_record = TestRecord.from_json(record_info)
        db.session.add(test_record)
        test_id = record_info['test_id']
        test_info = TestList.query.filter_by(id=test_id).first()  # 累加参与了做题的人数
        test_info.test_sum += 1
        db.session.add(test_info)
        behavior = TestBehavior.query.filter_by(user_id=user.id, test_id=test_id).first()
        if behavior is None:
            record = TestBehavior(user_id=user.id, test_id=test_id, is_test=True)
            db.session.add(record)
        else:
            behavior.is_like = True
            db.session.add(behavior)
        db.session.commit()
        return jsonify({
            "status": 'create rest record successfully',
            "test_record_id": test_record.id
        })
    elif db_record is not None and db_record.is_finished is False:
        return jsonify({
            "status": "test not finished , reset record",
            "test_record_id": db_record.id
        })
    else:
        return jsonify({
            "status": "test finished",
            "test_record_id": db_record.id
        })


@main.route('/api/test-list/test-answer/<int:pid>', methods=['POST'])
@login_required
def judge_test_answer(pid):
    problem = TestProblem.query.get_or_404(pid)
    answer_info = request.json
    problem_type = answer_info['problem_type']
    answer_info['problem_id'] = problem.id
    answer_info['right_answer'] = problem.right_answer
    ans_record = AnswerRecord.from_json(answer_info)
    db.session.add(ans_record)
    db.session.commit()
    if problem_type == 0 and answer_info.get('user_answer') == problem.right_answer:
        return self_response('True')
    else:
        return self_response('False')


@main.route('/api/test-list/clean-record/<int:tid>', methods=['GET'])
@login_required
def clean_record(tid):
    user = g.current_user
    old_record = TestRecord.query.filter_by(id=tid).first()
    all_ans_record = AnswerRecord.query.filter_by(test_record_id=tid, answerer_id=user.id).all()
    db.session.delete(old_record)
    if all_ans_record is not None:
        for ans in all_ans_record:
            db.session.delete(ans)
    db.session.commit()
    return self_response("clean old record successfully")


@main.route('/api/test-list/over-test/<int:tid>', methods=['GET'])
@login_required
def over_test(tid):
    user = g.current_user
    test_record = TestRecord.query.filter_by(answerer_id=user.id, test_list_id=tid).first()
    if not test_record:
        return not_found()
    all_answer = AnswerRecord.query.filter_by(answerer_id=user.id, test_list_id=tid, test_record_id=test_record.id).all()
    right_count = 0
    choice_count = 0
    for ans in all_answer:
        if ans.problem_type == 0:
            if ans.user_answer == ans.right_answer:
                right_count += 1
            else:
                pass
            choice_count += 1
        else:
            pass
    try:
        accuracy = round(right_count/float(choice_count), 2)
    except ZeroDivisionError:
        accuracy = 0
    test_record.test_accuracy = accuracy
    test_record.is_finished = True
    db.session.add(test_record)
    db.session.commit()
    return jsonify({
        "status": "calc accuracy complete",
        "choice_problems_count": choice_count,
        "accuracy": accuracy
    })


@main.route('/api/test-list/search', methods=['POST'])
def search_test_list():
    search_info = request.json
    key_word = search_info['key_words']
    page = request.args.get('page', 1, type=int)
    pagination = TestList.query.filter(TestList.test_title.like('%'+key_word+'%'), TestList.show == True).paginate(
        page, per_page=current_app.config['IDPLSS_POSTS_PER_PAGE'],
        error_out=False
    )
    all_test = pagination.items
    url_prev = None
    if pagination.has_prev:
        url_prev = url_for('main.search_test_list', page=page-1, _external=True)
    url_next = None
    if pagination.has_next:
        url_next = url_for('main.search_test_list', page=page+1, _external=True)
    return jsonify({
        'search_result': [test.to_json() for test in all_test],
        'prev': url_prev,
        'next': url_next,
        'count': pagination.total
    })


@main.route('/api/test-list/like/<int:tid>', methods=['GET'])
@user_login_info
def like_test(tid):
    test = TestList.query.get_or_404(tid)
    user = g.current_user
    test.like += 1
    db.session.add(test)
    if user is None:
        db.session.commit()
        return self_response("guest like test successfully")
    else:
        behavior = TestBehavior.query.filter_by(user_id=user.id, test_id=test.id).first()
        if behavior is None:
            record = TestBehavior(user_id=user.id, test_id=test.id, is_like=True)
            db.session.add(record)
        else:
            behavior.is_like = True
            db.session.add(behavior)
        db.session.commit()
        return self_response("login user like test successfully")




