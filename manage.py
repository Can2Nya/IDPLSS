# -*- coding: utf-8 -*-
"""
    manage
    ~~~~~~~~~~~~

    启动app

"""
from flask_script import Manager, Shell

from app import db
from app import create_app
from app import redis_store
from tests import CreateDate
from app.models import User, Role, Follow, Post, PostComment, Course, CourseComment, VideoList,  TextResource, \
    TextResourceComment, TestList, TestProblem, AnswerRecord, TestRecord, CourseBehavior, TestBehavior,\
    TextResourceBehavior

app = create_app()
manager = Manager(app)


def make_shell_context():
    return dict(app=app, db=db, User=User, Role=Role, Follow=Follow, Post=Post, PostComment=PostComment,
                Course=Course, CourseComment=CourseComment, VideoList=VideoList,
                TextResourceComment=TextResourceComment, TextResource=TextResource,
                TestList=TestList, TestProblem=TestProblem, AnswerRecord=AnswerRecord,
                TestRecord=TestRecord, CourseBehavior=CourseBehavior, TestBehavior=TestBehavior,
                TextResourceBehavior=TextResourceBehavior, redis_store=redis_store)

manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command("create_data", CreateDate())


if __name__ == '__main__':
    manager.run()
