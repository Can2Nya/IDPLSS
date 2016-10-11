# coding:utf-8
from flask import current_app, jsonify, g, request, url_for
from app.models import TestList, TestProblem, AnswerRecord, TestRecord, User, db, Permission
from app.main.decorators import get_current_user, permission_required
from app.main.responses import not_found, forbidden
from app.main.authentication import auth
from app.main import main
from app.utils.responses import self_response


@main.route('/api/test-list', methods=['GET'])
def test_list():
    page = request.args.get('page', 1, type=int)
    pagination = TestList.query.filter_by(show=True).order_by(TestList.timestamp.desc()).paginate(
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


@main.route('/api/test-list/detail/<int:tid>', methods=['GET', 'DELETE'])
def test_operation(tid):
    test = TestList.query.get_or_404(tid)
    if request.method == 'GET':
        if test.show is not False:
            return jsonify(test.to_json())
        else:
            return not_found()
    elif request.method == 'DELETE':
        test.show = False
        db.session.add(test)
        db.session.commit()
        return self_response('delete test successfully')
    else:
        return self_response('invalid operation')


@main.route('/api/test-list/category/<int:cid>', methods=['GET'])
def test_list_category(cid):
    page = request.args.get('page', 1, type=int)
    pagination = TestList.query.filter_by(show=True, test_category=cid).order_by(TestList.timestamp.desc()).paginate(
        page, per_page=current_app.config['IDPLSS_POSTS_PER_PAGE'],
        error_out=False
    )
    all_test = pagination.items
    prev_url = None
    if pagination.has_prev:
        prev_url = url_for('main.test_list_category', page=page-1, _external=True)
    next_url = None
    if pagination.has_next:
        next_url = url_for('main.test_list_category', page=page+1, _external=True)
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
@auth.login_required
@get_current_user
def new_problem(tid):
    problem = TestProblem.from_json(request.json)
    db.session.add(problem)
    db.session.commit()
    return self_response('add problem successfully')


@main.route('/api/test-list/<int:tid>/problems/<int:pid>', methods=['GET', 'DELETE'])
def problem_operation(tid, pid):
    problem = TestProblem.query.get_or_404(pid)
    if request.method == 'GET':
        if problem.show is not False:
            return jsonify(problem.to_json())
        else:
            return not_found()
    elif request.method == 'DELETE':
        problem.show = False
        db.session.add(problem)
        db.session.commit()
        return self_response('delete problem successfully')
    else:
        return self_response('invalid operation')


@main.route('/api/test-list/new-test-record', methods=['POST'])
@auth.login_required
@get_current_user
def new_test_record():
    test_record = TestRecord.from_json(request.json)
    db.session.add(test_record)
    db.session.commit()
    return jsonify({
        "status": 'create rest record successfully',
        "test_record_id": test_record.id
    })


@main.route('/api/test-list/test-answer/<int:pid>', methods=['POST'])
@auth.login_required
def judge_test_answer(pid):
    problem = TestProblem.query.get_or_404(pid)
    answer_info = request.json
    answer_info['problem_id'] = problem.id
    answer_info['right_answer'] = problem.right_answer
    ans_record = AnswerRecord.from_json(answer_info)
    db.session.add(ans_record)
    db.session.commit()
    if answer_info.get('user_answer') == problem.right_answer:
        return self_response('True')
    else:
        return self_response('False')


@main.route('/api/test-list/over-test/<int:tid>', methods=['GET'])
@auth.login_required
@get_current_user
def over_test(tid):
    user = g.current_user
    test_record = TestRecord.query.filter_by(answerer_id=user.id, id=tid).first()
    if test_record is None:
        return not_found()
    else:
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
            accuracy = right_count/float(choice_count)
        except ZeroDivisionError:
            accuracy = 0
        test_record.test_accuracy = accuracy
        db.session.add(test_record)
        db.session.commit()
        return jsonify({
            "status": "calc accuracy complete",
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




