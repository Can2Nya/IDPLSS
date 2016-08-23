# coding: utf-8
from flask import jsonify
from application.main import main


def not_found():
    response = jsonify({'error': 'not found'})
    response.status_code = 404
    return response


def forbidden(message):
    response = jsonify({'error': 'forbidden', 'message': message})
    response.status_code = 403
    return response


def bad_request(message):
    response = jsonify({'error': 'bad_request', 'message': message})
    response.status_code = 400
    return response


def unauthorized(message):
    response = jsonify({'error': 'unauthorized', 'message': message})
    response.status_code = 401
    return response


def method_not_allowed(message):
    response = jsonify({'error': 'method_not_allowed', 'message': message})
    response.status_code = 405
    return response

