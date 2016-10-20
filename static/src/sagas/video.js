import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
// import { getVideoCategory, 
// 		getVideoDetailList,
// 		getVideoDetail } from '../services/video';
import * as req from '../services/video';
import { message } from 'antd';

// import { data } from '../services/video.js';//

function* getVideoCategorySource(action) {
	try {
		const { jsonResult } = yield call(req.getVideoCategory, action);
		if (jsonResult) {
			yield put({
				type: 'video/get/success/categorySource',
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		yield put({
		  type: 'video/get/failed/categorySource',
		  err,
		});
	}
}
function* getVideoRecommendSource(action) {
	try {
		const { jsonResult } = yield call(req.getVideoCategory, action);
		if (jsonResult) {
			yield put({
				type: 'video/get/success/recommend',
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		yield put({
		  type: 'video/get/failed/recommend',
		  err,
		});
	}
}

function* getVideoDetailSource(action) {
	try {
		const { jsonResult } = yield call(req.getVideoDetail, action);
		if (jsonResult) {
			yield put({
				type: `video/get/success/detail`,
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'video/get/failed/recommend',
		//   err,
		// });
	}
}

function* getVideoDetailListSource(action) {
	try {
		const { jsonResult } = yield call(req.getVideoDetailList, action);
		if (jsonResult) {
			if(action.type == 'video/get/series') {
				yield put({
					type: `video/get/success/series`,
					payload: jsonResult,
				});
			}
			if(action.type == 'video/get/comment') {
				yield put({
					type: `video/get/success/comment`,
					payload: jsonResult,
				});
			}
			
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'video/get/failed/recommend',
		//   err,
		// });
	}
}

function* postVideoDetailCommentSource(action) {
	try {
		const { jsonResult } = yield call(req.postVideoDetailComment, action);
		if (jsonResult) {
			message.success(jsonResult.status);
			// yield put({
			// 	type: `video/get/success/${data['fuc']}`,
			// 	payload: jsonResult,
			// });
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'video/get/failed/recommend',
		//   err,
		// });
	}
}

function* deleteVideoDetailCommentSource(action) {
	try {
		const { jsonResult } = yield call(req.deleteVideoDetailComment, action);
		if (jsonResult) {
			message.success(jsonResult.status);
			// yield put({
			// 	type: `video/get/success/${data['fuc']}`,
			// 	payload: jsonResult,
			// });
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'video/get/failed/recommend',
		//   err,
		// });
	}
}

function* watchVideoCategorySourceGet() {
	yield takeLatest('video/get/categorySource', getVideoCategorySource)
}
function* watchVideoRecommendGet() {
	yield takeLatest('video/get/recommend', getVideoRecommendSource)
}
function* watchVideoDetailGet() {
	yield takeLatest('video/get/detail', getVideoDetailSource)
}
function* watchVideoDetailListGet() {
	yield takeLatest(['video/get/series','video/get/comment'], getVideoDetailListSource)
}
function* watchVideoDetailCommentPost() {
	yield takeLatest('video/post/comment', postVideoDetailCommentSource)
}
function* watchVideoDetailCommentDelete() {
	yield takeLatest('video/delete/comment', deleteVideoDetailCommentSource)
}

export default function* () {
	yield fork(watchVideoCategorySourceGet);
	yield fork(watchVideoRecommendGet)
	yield fork(watchVideoDetailGet)
	yield fork(watchVideoDetailListGet)
	yield fork(watchVideoDetailCommentPost)
	yield fork(watchVideoDetailCommentDelete)
	// Load video.
	//yield put({
	//	type: 'video/get/categorySource',

	//});
}
