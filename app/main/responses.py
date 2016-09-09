# coding: utf-8
from flask import jsonify, request
from app.main import main
from app.main.decorators import allow_cross_domain


@allow_cross_domain
def update_status(message):
    response = jsonify({'status': message})
    response.status_code = 201
    return response


@allow_cross_domain
def not_found():
    response = jsonify({'error': 'not found'})
    response.status_code = 404
    return response


@allow_cross_domain
def forbidden(message):
    response = jsonify({'error': 'forbidden', 'message': message})
    response.status_code = 403
    return response


@allow_cross_domain
def bad_request(message):
    response = jsonify({'error': 'bad_request', 'message': message})
    response.status_code = 400
    return response


@allow_cross_domain
def unauthorized(message):
    response = jsonify({'error': 'unauthorized', 'message': message})
    response.status_code = 401
    return response


@allow_cross_domain
def method_not_allowed(message):
    response = jsonify({'error': 'method_not_allowed', 'message': message})
    response.status_code = 405
    return response


@main.app_errorhandler(404)
@allow_cross_domain
def info_not_found(e):
    if request.accept_mimetypes.accept_json:
        response = jsonify({'error': 'post data error ,query info does not exist'})
        response.status_code = 404
        return response


@allow_cross_domain
def test_response(message):
    response = jsonify({'status': message})
    response.status_code = 200
    return response

