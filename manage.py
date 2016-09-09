# coding: utf-8
from flask.ext.script import Manager, Shell
from app import create_app, db
from app.models import User, Role, Follow, Post, PostComment, CourseVideo, VideoComment, TextResource, TextResourceComment

app = create_app()
manager = Manager(app)


def make_shell_context():
    return dict(app=app, db=db, User=User, Role=Role, Follow=Follow, Post=Post, PostComment=PostComment,
                CourseVideo=CourseVideo, VideoComment=VideoComment,
                TextResourceComment=TextResourceComment, TextResource=TextResource)

manager.add_command("shell", Shell(make_context=make_shell_context))


if __name__ == '__main__':
    manager.run()
