# coding: utf-8
from flask import Blueprint

resource = Blueprint('resource', __name__)

from . import views
