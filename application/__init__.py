# coding: utf-8
from flask import Flask
from flask.ext.moment import Moment
from flask.ext.mail import Mail
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from config import configs, ENV


mail = Mail()
moment = Moment()
db = SQLAlchemy()
login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'auth.login'
login_manager.login_message = u'请登录之后再尝试操作'


def create_app():
    app = Flask(__name__, static_folder="../static/dist", template_folder="../static")
    app.config.from_object(configs[ENV])
    configs[ENV].init_app(app)
    mail.init_app(app)
    moment.init_app(app)
    db.init_app(app)
    login_manager.init_app(app)
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)
    from .communion import communion as communion_print
    app.register_blueprint(communion_print)
    from .courses import courses as courses_print
    app.register_blueprint(courses_print)
    from .oltest import oltest as oltest_print
    app.register_blueprint(oltest_print)
    from resource import resource as resource_print
    app.register_blueprint(resource_print)
    return app


