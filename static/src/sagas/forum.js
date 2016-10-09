import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
// import { getForumList } from '../services/forum';
import * as req from '../services/forum';
import { message } from 'antd';

function* getForumCategorySource() {
	try {
		const { jsonResult } = yield call(req.getForumCategory);
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
		  err,
		});
	}
}
function* getForumRecommendSource() {
	try {
		const { jsonResult } = yield call(req.getForumCategory);
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
		  err,
		});
	}
}

function* getForumDetailSource() {
	try {
		const { jsonResult } = yield call(req.getForumDetail);
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
		//   err,
		// });
	}
}

// function* getForumDetailListSource() {
// 	try {
// 		const { jsonResult } = yield call(req.getForumDetailList);
// 		if (jsonResult) {
// 			yield put({
// 				type: `forum/get/success/${data['fuc']}`,
// 				payload: jsonResult,
// 			});
// 		}
// 	} catch (err) {
// 		message.error(err);
// 		// yield put({
// 		//   type: 'forum/get/failed/recommend',
// 		//   err,
// 		// });
// 	}
// }

function* postForumDetailCommentSource() {
	try {
		const { jsonResult } = yield call(req.postForumDetailComment);
		if (jsonResult) {
			message.success(jsonResult.status);
			// yield put({
			// 	type: `forum/get/success/${data['fuc']}`,
			// 	payload: jsonResult,
			// });
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'forum/get/failed/recommend',
		//   err,
		// });
	}
}

function* deleteForumDetailCommentSource() {
	try {
		const { jsonResult } = yield call(req.deleteForumDetailComment);
		if (jsonResult) {
			message.success(jsonResult.status);
			// yield put({
			// 	type: `forum/get/success/${data['fuc']}`,
			// 	payload: jsonResult,
			// });
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'forum/get/failed/recommend',
		//   err,
		// });
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
// function* watchForumDetailListGet() {
// 	yield takeLatest(['forum/get/series','forum/get/comment'], getForumDetailListSource)
// }
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
	// yield fork(watchForumDetailListGet)
	yield fork(watchForumDetailCommentPost)
	yield fork(watchForumDetailCommentDelete)
	// Load forum.
	//yield put({
	//	type: 'forum/get/categorySource',

	//});
}
