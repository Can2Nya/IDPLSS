# coding: utf-8
from flask import Flask
from flask.ext.moment import Moment
from flask.ext.mail import Mail
from flask.ext.sqlalchemy import SQLAlchemy
from config import configs, ENV


mail = Mail()
moment = Moment()
db = SQLAlchemy()


def create_app():
    """
    创建程序上下文,初始化各个第三方库
    :return:app
    """
    app = Flask(__name__, static_folder="../static/dist")
    app.config.from_object(configs[ENV])
    configs[ENV].init_app(app)
    mail.init_app(app)
    moment.init_app(app)
    db.init_app(app)
    from application.main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app


