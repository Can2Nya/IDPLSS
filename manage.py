# coding: utf-8
from flask_script import Manager, Shell
from app import create_app, db
from app.models import User, Role, Follow, Post, PostComment, Course, CourseComment, VideoList,  TextResource, \
    TextResourceComment, TestList, TestProblem, AnswerRecord, TestRecord, CourseBehavior, TestBehavior,\
    TextResourceBehavior
from tests import CreateDate


app = create_app()
manager = Manager(app)


def make_shell_context():
    return dict(app=app, db=db, User=User, Role=Role, Follow=Follow, Post=Post, PostComment=PostComment,
                Course=Course, CourseComment=CourseComment, VideoList=VideoList,
                TextResourceComment=TextResourceComment, TextResource=TextResource,
                TestList=TestList, TestProblem=TestProblem, AnswerRecord=AnswerRecord,
                TestRecord=TestRecord, CourseBehavior=CourseBehavior, TestBehavior=TestBehavior,
                TextResourceBehavior=TextResourceBehavior)

manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command("create_data", CreateDate())


if __name__ == '__main__':
    manager.run()
