# coding: utf-8
from flask import Blueprint


main = Blueprint('main', __name__)

from app.main import index, decorators, authentication, responses, users, communication, entrance, courses,\
    text_resource, online_test, errors, recommend