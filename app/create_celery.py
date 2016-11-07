# coding:utf-8
from flask import current_app
from celery import Celery


def make_celery(app):
    celery = Celery(app, broker=app.config['CELERY_BROKER_URL'],
                    backend=app.config['CELERY_RESULT_BACKEND'])
    celery.conf.update(app.config)
    task_base = celery.Task

    class ContextTask(task_base):

        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return task_base.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery


def celery_instance():
    celery = make_celery(current_app)
    return celery









