import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import * as req from '../services/text';
import { message } from 'antd';

import { data } from '../services/text.js';//

function* getTextCategorySource() {
	try {
		const { jsonResult } = yield call(req.getTextCategory);
		if (jsonResult) {
			yield put({
				type: 'text/get/success/categorySource',
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		yield put({
		  type: 'text/get/failed/categorySource',
		  err,
		});
	}
}
function* getTextRecommendSource() {
	try {
		const { jsonResult } = yield call(req.getTextCategory);
		if (jsonResult) {
			yield put({
				type: 'text/get/success/recommend',
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		yield put({
		  type: 'text/get/failed/recommend',
		  err,
		});
	}
}
function* getTextDetailSource() {
	try {
		const { jsonResult } = yield call(req.getTextDetail);
		if (jsonResult) {
			yield put({
				type: `text/get/success/detail`,
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'text/get/failed/recommend',
		//   err,
		// });
	}
}

function* getTextDetailListSource() {
	try {
		const { jsonResult } = yield call(req.getTextDetailList);
		if (jsonResult) {
			yield put({
				type: `text/get/success/comment`,
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'text/get/failed/recommend',
		//   err,
		// });
	}
}

function* postTextDetailCommentSource() {
	try {
		const { jsonResult } = yield call(req.postTextDetailComment);
		if (jsonResult) {
			message.success(jsonResult.status);
			// yield put({
			// 	type: `text/get/success/${data['fuc']}`,
			// 	payload: jsonResult,
			// });
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'text/get/failed/recommend',
		//   err,
		// });
	}
}

function* deleteTextDetailCommentSource() {
	try {
		const { jsonResult } = yield call(req.deleteTextDetailComment);
		if (jsonResult) {
			message.success(jsonResult.status);
			// yield put({
			// 	type: `text/get/success/${data['fuc']}`,
			// 	payload: jsonResult,
			// });
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'text/get/failed/recommend',
		//   err,
		// });
	}
}

function* watchTextCategorySourceGet() {
	yield takeLatest('text/get/categorySource', getTextCategorySource)
}
function* watchTextRecommendGet() {
	yield takeLatest('text/get/recommend', getTextRecommendSource)
}
function* watchTextDetailGet() {
	yield takeLatest('text/get/detail', getTextDetailSource)
}
function* watchTextDetailListGet() {
	yield takeLatest(['text/get/series','text/get/comment'], getTextDetailListSource)
}
function* watchTextDetailCommentPost() {
	yield takeLatest('text/post/comment', postTextDetailCommentSource)
}
function* watchTextDetailCommentDelete() {
	yield takeLatest('text/delete/comment', deleteTextDetailCommentSource)
}

export default function* () {
	yield fork(watchTextCategorySourceGet);
	yield fork(watchTextRecommendGet)
	yield fork(watchTextDetailGet)
	yield fork(watchTextDetailListGet)
	yield fork(watchTextDetailCommentPost)
	yield fork(watchTextDetailCommentDelete)
	// Load text.
	//yield put({
	//	type: 'text/get/categorySource',

	//});
}
