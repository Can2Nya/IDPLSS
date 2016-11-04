# coding:utf-8
from celery import Celery

try:
    from flask import _app_ctx_stack as stack
except ImportError:
    from flask import _request_ctx_stack


def make_celery(app):
    celery = Celery(app,
                        broker=app.config['CELERY_BROKER_URL'],
                        backend=app.config['CELERY_RESULT_BACKEND'])
    celery.conf.update(app.config)
    task_base = celery.Task

    class ContextTask(task_base):

        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return task_base.__call__(self, *args, **kwargs)
    celery.Task = ContextTask




class CeleryInstance(object):
    def __init__(self, app=None, broker_url , result_url):
        self.app = app
        self.broker_url = broker_url,
        self.result_url = result_url
        if app is None:
            self.init_app(app)


    def init_app(self, app):
        celery = Celery(app,
                        broker=self.broker_url,
                        backend=self.result_url)
        celery.conf.update(app.config)
        task_base = celery.Task

        class ContextTask(task_base):

            abstract = True

            def __call__(self, *args, **kwargs):
                with app.app_context():
                    return task_base.__call__(self, *args, **kwargs)
        celery.Task = ContextTask


