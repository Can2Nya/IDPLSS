# coding:utf-8
from flask import current_app, jsonify, g, request, url_for
from app.models import TestList, TestProblem, AnswerRecord, TestRecord, User, db, Permission, TestBehavior
from app.main.decorators import get_current_user, permission_required, user_login_info
from app.main.responses import not_found, forbidden
from app.main.authentication import auth
from app.main import main
from app.utils.responses import self_response
from app.utils.model_tools import have_school_permission


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
        if user.id == test.author_id or have_school_permission(user):
            test.show = False
            all_users = User.query.all()
            for u in all_users:   # 测试已经删除,将关联的测试记录也删除
                record = TestRecord.query.filter_by(answerer_id=u.id, test_list_id=test.id).first()
                if record is not None:
                    db.session.delete(record)
                    all_answer_record = AnswerRecord.query.filter_by(answerer_id=u.id, test_record_id=record.id).all()
                    if all_answer_record is not None:
                        for r in all_answer_record:
                            db.session.delete(r)
            all_behaviors = TestBehavior.query.filter_by(test_id=test.id).all()
            if all_behaviors is not None:
                for b in all_behaviors:
                    db.session.delete(b)
            db.session.add(test)
            db.session.commit()
            return self_response('delete test successfully')
        else:
            return forbidden('does not have permission to delete this test')
    elif request.method == 'PUT':
        if user.id == test.author_id or have_school_permission(user):
            modidy_info = request.json
            test.test_title = modidy_info['title']
            test.test_description = modidy_info['description']
            test.test_category = modidy_info['category']
            test.key_words = modidy_info['key_words']
            test.image = modidy_info['image']
            db.session.add(test)
            db.session.commit()
            return self_response('test information update successfully')
        else:
            return self_response('does not have permission to update this test')
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
@auth.login_required
@get_current_user
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
        if user.id == problem.author_id or have_school_permission(user):
            problem.show = False
            db.session.add(problem)
            db.session.commit()
            return self_response('delete problem successfully')
        else:
            return forbidden('does not have permission to delete this problem')
    elif request.method == 'PUT':
        if user.id == problem.author_id or have_school_permission(user):
            modify_info = request.json
            problem.right_answer = modify_info['right_answer']
            problem.choice_a = modify_info['choice_a']
            problem.choice_b = modify_info['choice_b']
            problem.choice_c = modify_info['choice_c']
            problem.choice_d = modify_info['choice_d']
            problem.problem_description = modify_info['problem_description']
            problem.description_image = modify_info['description_image']
            problem.problem_type = modify_info['problem_type']
            problem.answer_explain = modify_info['answer_explain']
            db.session.add(problem)
            db.session.commit()
            return self_response("update problem info successfully")
        else:
            return forbidden('does not have permission to edit this problem')

    else:
        return self_response('invalid operation')


@main.route('/api/test-list/new-test-record', methods=['POST'])
@auth.login_required
@get_current_user
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


@main.route('/api/test-list/clean-record/<int:tid>', methods=['GET'])
@auth.login_required
@get_current_user
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




