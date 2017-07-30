import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import { message } from 'antd';

const errorMessages = (res) => `${res.status} ${res.statusText}`;

function check401(res) {
	if (res.status === 401) {
	//location.href = '/401';
	return Promise.reject(errorMessages(res));
	}
	return res;
}

function check400(res) {
	if (res.status === 400) {
	//location.href = '/401';
	
	return Promise.reject(errorMessages(res));
	}
	return res;
}

function check105(res) {
	if (res.status === 105) {
	//location.href = '/401';
	return Promise.reject(errorMessages(res));
	}
	return res;
}

function check502(res) {
	if (res.status === 502) {
	//location.href = '/401';
	return Promise.reject(errorMessages(res));
	}
	return res;
}

function check404(res) {
	if (res.status === 404) {
	return Promise.reject(errorMessages(res));
	}
	return res;
}

function jsonParse(res) {
	return res.json().then(jsonResult => ({ ...res, jsonResult }));
}

function errorMessageParse(res) {
	const { error, message } = res.jsonResult;
	if (error) {
	return Promise.reject(message);
	}
	return res;
}

function xFetch(url, options) {

	const opts = { ...options };
	opts.headers = {
	...opts.headers,
	Accept: 'application/json',
	'Content-Type': 'application/json',
	authorization: cookie.get('authorization') || '',
	};
	try{
		return fetch(url, opts)
			.then(check401)
			.then(check105)
			.then(check502)
			.then(check404)
			.then(jsonParse)
			.then(errorMessageParse);
	}catch(err){
		console.log(err);
	}
}

export default xFetch;
