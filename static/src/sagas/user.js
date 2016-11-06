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
			if(type == 'user/set/info'){
				message.success('成功修改资料');
				put({
					type: 'user/get/info',
					user_id: action.user_id,
				})
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

function* getUpLoadInfo(action) {
	try {
		const { jsonResult } = yield call(req.UserUpLoadInfo, action);
		if (jsonResult) {
			if (action.type == 'upload/get/token') {
				yield put({
					type: 'upload/get/success/token',
					payload: jsonResult.uptoken,
				});
			}else{
				if (action.type.search('List') !== -1) {
					yield put({
						type: 'upload/get/success/isSelectContextList',
						payload: jsonResult.problems || jsonResult.course_video
					})	
				}else{
					yield put({
						type: 'upload/get/success/isSelectContext',
						payload: jsonResult
					})
				}
				yield put({
					type: 'upload/changeEditState',
					isEdit: true,
					isSelectContextId: action.id,
				})
			}

		}
	} catch (err) {
		message.error(err);
	}
}

function* postCreateMainData(action) {
	try {
		if(action.type.search('post') !== -1) {
			const { jsonResult } = yield call(req.UserCreateMainData, action);
			if (jsonResult) {
				message.success('创建成功')
			}
			let nextAction = 'user/get/user';
			if(action.type == 'upload/post/createCourse') nextAction += 'Video'
			if(action.type == 'upload/post/createText') nextAction += 'Text'
			if(action.type == 'upload/post/createTest') nextAction += 'Test'
			if(action.type == 'upload/post/createPost') nextAction =  `forum/get/categorySource`
			yield put({
				type: nextAction,
				pagination: 1
			})
		};
		if(action.type.search('put') !== -1) {
			const { jsonResult } = yield call(req.UserPutMainData, action);
			if (jsonResult) {
				message.success('修改成功')
			}
			let nextAction = 'user/get/user';
			if(action.type == 'upload/put/createCourse') nextAction += 'Video'
			if(action.type == 'upload/put/createText') nextAction += 'Text'
			if(action.type == 'upload/put/createTest') nextAction += 'Test'
			yield put({
				type: nextAction,
				pagination: 1
			})
		};
	} catch (err) {
		message.error(err);
	}
}

function* getUserRecommend(action) {
	try {
		const { jsonResult } = yield call(req.UserRecommend, action);
		if (jsonResult) {
			if(jsonResult.count){
				yield put({
					type: 'user/get/recommend/success',
					payload: jsonResult.recommend_courses || jsonResult.recommend_text_resources || jsonResult.recommend_tests,
				});
			}
			
		}
	} catch (err) {
		message.error(`网络错误:${err}`);
	}
}



function* watchUserLogin() {
	yield* takeLatest('user/login', login)
}
function* watchUserGet() {
	yield* takeEvery(['user/get/info','user/get/loginInfo','user/set/info'], getUser)
}
// function* watchUserSet() {
// 	yield* takeLatest(, setUser)
// }
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
function* watchUpLoadInfo() {
	yield* takeLatest([
		'upload/get/token',
		'upload/get/userVideo',
		'upload/get/userText',
		'upload/get/userTest',
		'upload/get/userVideoList',
		'upload/get/userTestList'
		], getUpLoadInfo)
}
function* watchCreateMainData() {
	yield* takeLatest([
		'upload/post/createCourse',
		'upload/post/createText',
		'upload/post/createTest',
		'upload/post/createPost',
		'upload/put/createCourse',
		'upload/put/createText',
		'upload/put/createTest'
		], postCreateMainData)
}
function* watchUserRecommend() {
	yield* takeLatest([
		'user/get/videoRecommend',
		'user/get/textRecommend',
		'user/get/testRecommend'
		], getUserRecommend)
}


/*function* watchUserGetJson() {
	yield* takeLatest(['user/login','user/getInfo','user/register'], getJson)
}*/

export default function* () {
	yield fork(watchUserLogin);
	yield fork(watchUserGet);
	// yield fork(watchUserSet);
	yield fork(watchUserRegister);
	yield fork(watchUserRegisterConfirm);
	yield fork(watchisFollowing);
	yield fork(watchisFollowedBy);
	yield fork(watchUserZoneData);
	yield fork(watchUpLoadInfo);
	yield fork(watchCreateMainData)
	yield fork(watchUserRecommend)
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
