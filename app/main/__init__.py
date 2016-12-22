# coding: utf-8
from flask import Blueprint


main = Blueprint('main', __name__)


from . import decorators, authentication, responses, user, forum, courses,\
    text_resource, online_test, errors, recommend, admin

