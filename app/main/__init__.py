# coding: utf-8
from flask import Blueprint


main = Blueprint('main', __name__)


from app.main import decorators, authentication, responses, users, communication, courses,\
    text_resource, online_test, errors, recommend, admin