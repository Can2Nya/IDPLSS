# coding: utf-8
from flask import Flask
from flask_moment import Moment
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import configs, ENV
import redis
from flask_celery import Celery


mail = Mail()
moment = Moment()
db = SQLAlchemy()
cors = CORS()
celery = Celery()


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
    celery.init_app(app)
    from app.main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    redis_pool = redis.ConnectionPool(host=app.config['REDIS_IP_ADDRESS'], port=app.config['REDIS_ADDRESS_POST'], db=0)
    redis_conn = redis.StrictRedis(connection_pool=redis_pool)
    return app, redis_conn


