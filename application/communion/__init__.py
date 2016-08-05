# coding: utf-8
from flask import Blueprint

communion = Blueprint('communion', __name__)

from . import views