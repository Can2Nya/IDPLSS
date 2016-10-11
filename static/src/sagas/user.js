import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';

import { message } from 'antd';

// import { getUserState, 
// 	setUserState, 
// 	UserisFollowing, 
// 	UserisFollowedBy, 
// 	userRegister,
// 	userRegisterConfirm } from '../services/user';
import * as req from '../services/user';

function* login() {
	try {
		const { jsonResult } = yield call(req.userLogin);
		if (jsonResult) {
			yield put({
				type: 'user/login/success',
				payload: jsonResult,
			});
			yield put({
				type: 'user/get/info',
			})
		}
	} catch (err) {
		message.error(err);
		yield put({
			type: 'user/login/failed',
		});
	}
}

function* getUser() {
	try {
		const { jsonResult } = yield call(req.getUserState);
		if (jsonResult) {
			yield put({
				type: 'user/get/success/info',
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		// yield put({
		// 	type: 'user/login/failed',
		// });
	}
}

function* setUser() {
	try {
		const { jsonResult } = yield call(req.setUserState);
		if (jsonResult) {
			//yield put({
				//type: 'user/login/success',
				//payload: jsonResult,
			//});
			console.log(jsonResult)
		}
	} catch (err) {
		message.error(err);
		//yield put({
		//  type: 'user/login/failed',
		//  err,
		//});
	}
}

function* register() {
	try {
		const { jsonResult } = yield call(req.userRegister);
		if (jsonResult) {
			yield put({
				type: 'user/register/success',
			});
		}
	} catch (err) {
		message.error(err);
		yield put({
			type: 'user/register/failed',
			err,
		});
	}
}

function* registerConfirm() {
	try {
		const { jsonResult } = yield call(req.userRegisterConfirm);
		if (jsonResult) {
			yield put({
				type: 'user/register/confirm/success',
			});
		}
	} catch (err) {
		//message.error(err);
		yield put({
			type: 'user/register/confirm/failed',
			err,
		});
	}
}

function* isFollowing() {
	try {
		const { jsonResult } = yield call(req.UserisFollowing);
		if (jsonResult) {
			//yield put({
				//type: 'user/login/success',
				//payload: jsonResult,
			//});
			console.log(jsonResult)
		}
	} catch (err) {
		message.error(err);
		//yield put({
		//  type: 'user/login/failed',
		//  err,
		//});
	}
}

function* isFollowedBy() {
	try {
		const { jsonResult } = yield call(req.UserisFollowedBy);
		if (jsonResult) {
			//yield put({
				//type: 'user/login/success',
				//payload: jsonResult,
			//});
			console.log(jsonResult)
		}
	} catch (err) {
		message.error(err);
		//yield put({
		//  type: 'user/login/failed',
		//  err,
		//});
	}
}



function* watchUserLogin() {
	yield* takeLatest('user/login', login)
}
function* watchUserGet() {
	yield* takeLatest('user/get/info', getUser)
}
function* watchUserSet() {
	yield* takeLatest('user/set/info', setUser)
}
function* watchUserRegister() {
	yield* takeLatest('user/register', register)
}
function* watchUserRegisterConfirm() {
	yield* takeLatest('user/register/confirm', registerConfirm)
}
function* watchisFollowing() {
	yield* takeLatest('user/info/isFollowing', isFollowing)
}
function* watchisFollowedBy() {
	yield* takeLatest('user/info/isFollowedBy', isFollowedBy)
}

/*function* watchUserGetJson() {
	yield* takeLatest(['user/login','user/getInfo','user/register'], getJson)
}*/

export default function* () {
	yield fork(watchUserLogin);
	yield fork(watchUserGet);
	yield fork(watchUserSet);
	yield fork(watchUserRegister);
	yield fork(watchUserRegisterConfirm);
	yield fork(watchisFollowing);
	yield fork(watchisFollowedBy);
	//yield fork(watchUserGetJson)
	// Load user.//
	// yield put({
	// 	type: 'user/login',//默认会触发的事件
	// });
	/*yield put({
		type: 'user/info/set'
	});
	yield put({
		type: 'user/info/isFollowing'
	});
	yield put({
		type: 'user/info/isFollowedBy'
	});*/
//put()https://developer.mozilla.org/zh-CN/docs/Web/API/Cache/put
//put() 等价于 dispatch({})
}
