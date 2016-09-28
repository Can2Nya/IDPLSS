import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';

const errorMessages = (res) => `${res.status} ${res.statusText}`;

function check401(res) {
  if (res.status === 401) {
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
  
  return fetch(url, opts)
	.then(jsonParse)
	.then(errorMessageParse)
	.then(check401)
	.then(check404);
}

export default xFetch;
