# -*- coding: utf-8 -*-
"""
    config
    ~~~~~~~~~~~~

    app config

"""
import os
basedir = os.path.abspath(os.path.dirname(__file__))

try:
    from .config import *
except ImportError:
    from .config_sample import *


class Config(object):
    SECRET_KEY = IDPLSS['SECRET_KEY']
    SQLALCHEMY_COMMIT_ON_TEARDOWN = IDPLSS['SQLALCHEMY_COMMIT_ON_TEARDOWN']
    IDPLSS_MAIL_SUBJECT_PREFIX = IDPLSS['IDPLSS_MAIL_SUBJECT_PREFIX']
    IDPLSS_MAIL_SENDER = IDPLSS['IDPLSS_MAIL_SENDER']
    IDPLSS_ADMIN = IDPLSS['IDPLSS_ADMIN']
    SQLALCHEMY_DATABASE_URI = IDPLSS['SQLALCHEMY_DATABASE_URI']
    SQLALCHEMY_TRACK_MODIFICATIONS = IDPLSS['SQLALCHEMY_TRACK_MODIFICATIONS']
    IDPLSS_POSTS_PER_PAGE = IDPLSS['IDPLSS_POSTS_PER_PAGE']
    IDPLSS_COMMENTS_PER_PAGE = IDPLSS['IDPLSS_COMMENTS_PER_PAGE']
    IDPLSS_COMMON_COUNT = IDPLSS['IDPLSS_COMMON_COUNT']
    MAIL_SERVER = MAIL['MAIL_SERVER']
    MAIL_PORT = MAIL['MAIL_PORT']
    MAIL_USE_TLS = MAIL['MAIL_USE_TLS']
    MAIL_USERNAME = MAIL['MAIL_USERNAME']
    MAIL_PASSWORD = MAIL['MAIL_PASSWORD']
    QINIU_ACCESS_KEY = QINIU['ACCESS_KEY']
    QINIU_SECRET_KEY = QINIU['SECRET_KEY']
    CELERY_BROKER_URL = CELERY['CELERY_BROKER_URL']
    CELERY_RESULT_BACKEND = CELERY['CELERY_RESULT_BACKEND']
    CELERY_ACCEPT_CONTENT = CELERY['CELERY_ACCEPT_CONTENT']
    REDIS_IP_ADDRESS = REDIS['REDIS_IP_ADDRESS']
    REDIS_ADDRESS_POST = REDIS['REDIS_ADDRESS_POST']
    REDIS_URL = REDIS['REDIS_URL']

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True


class ProductionConfig(Config):
    TESTING = False


configs = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig,
}