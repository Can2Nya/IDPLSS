# coding: utf-8
from flask import Blueprint


main = Blueprint('main', __name__)


from application.main import index, decorators, authentication, errors, entrance