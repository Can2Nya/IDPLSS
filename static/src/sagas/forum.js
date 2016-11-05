import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
// import { getForumList } from '../services/forum';
import * as req from '../services/forum';
import { message } from 'antd';

function* getForumCategorySource(action) {
	try {
		const { jsonResult } = yield call(req.getForumCategory, action);
		if (jsonResult) {
			yield put({
				type: 'forum/get/success/categorySource',
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		yield put({
		  type: 'forum/get/failed/categorySource',
		  
		});
	}
}
function* getForumRecommendSource(action) {
	try {
		const { jsonResult } = yield call(req.getForumCategory, action);
		if (jsonResult) {
			yield put({
				type: 'forum/get/success/recommend',
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		yield put({
		  type: 'forum/get/failed/recommend',
		  
		});
	}
}

function* getForumDetailSource(action) {
	try {
		const { jsonResult } = yield call(req.getForumDetail, action);
		if (jsonResult) {
			yield put({
				type: `forum/get/success/detail`,
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'forum/get/failed/recommend',
		//   
		// });
	}
}

// function* postForumDetailSource(action) {
// 	try {
// 		const { jsonResult } = yield call(req.postForumDetail, action);
// 		if (jsonResult) {
// 			yield put({
// 				type: 'forum/get/categorySource',
// 			});
// 		}
// 	} catch (err) {
// 		message.error('创建失败');
// 	}
// }

function* getForumDetailCommentSource(action) {
	try {
		const { jsonResult } = yield call(req.getForumDetailList, action);
		if (jsonResult) {
			yield put({
				type: 'forum/get/success/comment',
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
	}
}

function* postForumDetailCommentSource(action) {
	try {
		const { jsonResult } = yield call(req.postForumDetailComment, action);
		if (jsonResult) {
			message.success(jsonResult.status);
			
			yield put({
				type: 'forum/get/comment',
				id: action.id,
				pagination: 1
			})
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'forum/get/failed/recommend',
		//   
		// });
	}
}

function* deleteForumDetailCommentSource(action) {
	try {
		const { jsonResult } = yield call(req.deleteForumDetailComment, action);
		if (jsonResult) {
			message.success(jsonResult.status);
			yield put({
				type: 'forum/get/comment',
				id: action.id,
				pagination: 1
			})
		}
	} catch (err) {
		message.error(err);
	}
}

function* watchForumCategorySourceGet() {
	yield takeLatest('forum/get/categorySource', getForumCategorySource)
}
function* watchForumRecommendGet() {
	yield takeLatest('forum/get/recommend', getForumRecommendSource)
}
function* watchForumDetailGet() {
	yield takeLatest('forum/get/detail', getForumDetailSource)
}
// function* watchForumDetailPost() {
// 	yield takeLatest('forum/post/detail', postForumDetailSource)
// }
function* watchForumDetailListGet() {
	yield takeLatest('forum/get/comment', getForumDetailCommentSource)
}
function* watchForumDetailCommentPost() {
	yield takeLatest('forum/post/comment', postForumDetailCommentSource)
}
function* watchForumDetailCommentDelete() {
	yield takeLatest('forum/delete/comment', deleteForumDetailCommentSource)
}

export default function* () {
	yield fork(watchForumCategorySourceGet);
	yield fork(watchForumRecommendGet)
	yield fork(watchForumDetailGet)
	// yield fork(watchForumDetailPost)
	yield fork(watchForumDetailListGet)
	yield fork(watchForumDetailCommentPost)
	yield fork(watchForumDetailCommentDelete)
}
