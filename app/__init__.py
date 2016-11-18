# coding: utf-8
from flask import Flask, g
from flask_moment import Moment
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import configs, ENV
from flask_redis import FlaskRedis
from celery import Celery


mail = Mail()
moment = Moment()
db = SQLAlchemy()
cors = CORS()
redis_store = FlaskRedis()

celery = Celery(__name__, broker=configs[ENV].CELERY_BROKER_URL)


def create_app():
    """
    创建程序上下文,初始化各个第三方库
    :return:app
    """
    app = Flask(__name__, static_folder="../static/dist")
    app.config.from_object(configs[ENV])
    configs[ENV].init_app(app)
    cors.init_app(app)
    mail.init_app(app)
    moment.init_app(app)
    db.init_app(app)
    redis_store.init_app(app)

    celery.conf.update(app.config)
    from app.main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    return app



