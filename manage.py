# coding: utf-8
from flask.ext.script import Manager, Shell
from application import create_app, db
from application.models import User, Role, Follow

app = create_app()
manager = Manager(app)


def make_shell_context():
    return dict(app=app, db=db, User=User, Role=Role, Follow=Follow)

manager.add_command("shell", Shell(make_context=make_shell_context))


if __name__ == '__main__':
    manager.run()
