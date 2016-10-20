import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import * as req from '../services/test';
import { message } from 'antd';

import { data } from '../services/test.js';//

function* getTestCategorySource(action) {
	try {
		const { jsonResult } = yield call(req.getTestCategory, action);
		if (jsonResult) {
			yield put({
				type: 'test/get/success/categorySource',
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		yield put({
		  type: 'test/get/failed/categorySource',
		  err,
		});
	}
}
function* getTestRecommendSource(action) {
	try {
		const { jsonResult } = yield call(req.getTestCategory, action);
		if (jsonResult) {
			yield put({
				type: 'test/get/success/recommend',
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		yield put({
		  type: 'test/get/failed/recommend',
		  err,
		});
	}
}

function* getTestDetailSource(action) {
	try {
		const { jsonResult } = yield call(req.getTestDetail, action);
		if (jsonResult) {
			yield put({
				type: `test/get/success/detail`,
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'test/get/failed/recommend',
		//   err,
		// });
	}
}

function* getTestDetailListSource(action) {
	try {
		const { jsonResult } = yield call(req.getTestDetailList, action);
		if (jsonResult) {
			yield put({
				type: `test/get/success/series`,
				payload: jsonResult,
			});
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'test/get/failed/recommend',
		//   err,
		// });
	}
}

// function* postTestDetailCommentSource() {
// 	try {
// 		const { jsonResult } = yield call(req.postTestDetailComment);
// 		if (jsonResult) {
// 			message.success(jsonResult.status);
// 			// yield put({
// 			// 	type: `test/get/success/${data['fuc']}`,
// 			// 	payload: jsonResult,
// 			// });
// 		}
// 	} catch (err) {
// 		message.error(err);
// 		// yield put({
// 		//   type: 'test/get/failed/recommend',
// 		//   err,
// 		// });
// 	}
// }

// function* deleteTestDetailCommentSource() {
// 	try {
// 		const { jsonResult } = yield call(req.deleteTestDetailComment);
// 		if (jsonResult) {
// 			message.success(jsonResult.status);
// 			// yield put({
// 			// 	type: `test/get/success/${data['fuc']}`,
// 			// 	payload: jsonResult,
// 			// });
// 		}
// 	} catch (err) {
// 		message.error(err);
// 		// yield put({
// 		//   type: 'test/get/failed/recommend',
// 		//   err,
// 		// });
// 	}
// }

function* watchTestCategorySourceGet() {
	yield takeLatest('test/get/categorySource', getTestCategorySource)
}
function* watchTestRecommendGet() {
	yield takeLatest('test/get/recommend', getTestRecommendSource)
}
function* watchTestDetailGet() {
	yield takeLatest('test/get/detail', getTestDetailSource)
}
function* watchTestDetailListGet() {
	yield takeLatest(['test/get/series','test/get/comment'], getTestDetailListSource)
}
// function* watchTestDetailCommentPost() {
// 	yield takeLatest('test/post/comment', postTestDetailCommentSource)
// }
// function* watchTestDetailCommentDelete() {
// 	yield takeLatest('test/delete/comment', deleteTestDetailCommentSource)
// }

export default function* () {
	yield fork(watchTestCategorySourceGet);
	yield fork(watchTestRecommendGet)
	yield fork(watchTestDetailGet)
	yield fork(watchTestDetailListGet)
	// yield fork(watchTestDetailCommentPost)
	// yield fork(watchTestDetailCommentDelete)
	// Load test.
	//yield put({
	//	type: 'test/get/categorySource',

	//});
}
