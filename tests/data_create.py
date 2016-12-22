# -*- coding: utf-8 -*-
"""
    tests.data_create
    ~~~~~~~~~~~~

    测试界面~伪造数据

"""

from app.models import *
from flask_script import Command


class CreateDate(Command):
    def run(self):
        db.drop_all()
        db.create_all()
        print 'start forge'
        Role.create_roles()
        User.add_user()
        print 'user data forge complete'
        User.generate_fake()
        Post.generate_fake()
        Course.generate_fake()
        TextResource.generate_fake()
        TestList.generate_fake()
        print 'basic class data forge complete'
        PostComment.generate_fake()
        CourseComment.generate_fake()
        VideoList.generate_fake()
        TextResourceComment.generate_fake()
        TestRecord.generate_fake()
        TestProblem.generate_fake()
        print 'comment data forge  complete'
        CourseBehavior.generate_fake()
        TextResourceBehavior.generate_fake()
        TestBehavior.generate_fake()
        print 'all data forge complete'
