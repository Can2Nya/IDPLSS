# coding: utf-8
from flask import Blueprint

oltest = Blueprint('oltest', __name__)

from . import views