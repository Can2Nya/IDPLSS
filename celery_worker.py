# -*- coding: utf-8 -*-
"""
    celery_worker
    ~~~~~~~~~~~~

    为celery创建app_context

"""
from app import create_app, celery

app = create_app()
app.app_context().push()