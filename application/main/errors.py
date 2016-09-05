# coding: utf-8
from flask import jsonify, request
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


@main.app_errorhandler(404)
def info_not_found(e):
    if request.accept_mimetypes.accept_json:
        response = jsonify({'error': 'post data error ,query info does not exist'})
        response.status_code = 404
        return response
