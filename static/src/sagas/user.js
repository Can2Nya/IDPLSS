import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';

import { message } from 'antd';

import * as req from '../services/user';

function* login(action) {
	try {
		const { jsonResult } = yield call(req.userLogin, action);
		if (jsonResult) {
			yield put({
				type: 'user/login/success',
				payload: jsonResult,
			});
			yield put({
				type: 'user/get/loginInfo',
				user_id: jsonResult.user_id
			})
		}
	} catch (err) {
		message.error(err);
		yield put({
			type: 'user/login/failed',
		});
	}
}

function* getUser(action) {// arg内有action参数
	try {
		const { jsonResult } = yield call(req.getUserState, action);
		const { type } = action
		if (jsonResult) {
			// if(type == 'user/login'){
			// 	yield put({
			// 		type: 'user/login/success',
			// 		payload: jsonResult,
			// 	});
			// }
			if(type == 'user/get/info'){
				yield put({
					type: 'user/get/success/info',
					payload: jsonResult,
				});
			}
			if(type == 'user/get/loginInfo'){
				yield put({
					type: 'user/get/success/loginInfo',
					payload: jsonResult
				});
			}
		}
	} catch (err) {
		message.error(err);
		// if(type == 'user/login'){
		// 	yield put({
		// 		type: 'user/login/failed',
		// 	});
		// }
	}
}

function* setUser(action) {
	try {
		const { jsonResult } = yield call(req.setUserState, action);
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

function* register(action) {
	try {
		const { jsonResult } = yield call(req.userRegister, action);
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

function* registerConfirm(action) {
	try {
		const { jsonResult } = yield call(req.userRegisterConfirm, action);
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

function* isFollowing(action) {
	try {
		const { jsonResult } = yield call(req.UserisFollowing, action);
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

function* isFollowedBy(action) {
	try {
		const { jsonResult } = yield call(req.UserisFollowedBy, action);
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
function* getUserZoneData(action) {
	try {
		const { jsonResult } = yield call(req.userZoneData, action);
		if (jsonResult) {
			if((action.type != 'user/get/userVideoList') || (action.type != 'user/get/userTestList')){
				yield put({
					type: 'user/get/zoneData/success',
					payload: jsonResult.collection_courses ||  jsonResult.posts || jsonResult.posts_comments || jsonResult.collection_posts || jsonResult.courses || jsonResult.course_comments || jsonResult.text_resources || jsonResult.course_comments || jsonResult.collection_text_resources || jsonResult.test_list || jsonResult.resource_comments || jsonResult.test_record ,
					total: jsonResult.count,
				})
			}
			else{
				yield put({
					type: 'user/get/zoneSubData/success',
					payload: jsonResult,
					total: jsonResult.count,
				})
			}
		}
	} catch (err) {
		message.error(err);
	}
}



function* watchUserLogin() {
	yield* takeLatest('user/login', login)
}
function* watchUserGet() {
	yield* takeEvery(['user/get/info','user/get/loginInfo'], getUser)
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
function* watchUserZoneData() {
	yield* takeLatest([
		'user/get/userPost',
		'user/get/userPostComment',
		'user/get/userPostCollection',
		'user/get/userVideo',
		'user/get/userVideoComment',
		'user/get/userVideoCollection',
		'user/get/userText',
		'user/get/userTextComment',
		'user/get/userTextCollection',
		'user/get/userTest',
		'user/get/userTestComplete'
		], getUserZoneData)
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
	yield fork(watchUserZoneData)
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
