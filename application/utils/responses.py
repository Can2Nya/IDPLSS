# coding :utf-8
from flask import jsonify


def make_response(message):
    response = jsonify({'status': message})
    response.status_code = 200
    return response

