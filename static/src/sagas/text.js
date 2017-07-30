import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import * as req from '../services/text';
import { message } from 'antd';

function* getTextCategorySource(action) {
	try {
		const { jsonResult } = yield call(req.getTextCategory, action);
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
function* getTextRecommendSource(action) {
	try {
		const { jsonResult } = yield call(req.getTextRecommend, action);
		if (jsonResult) {
			yield put({
				type: 'text/get/success/recommend',
				payload: jsonResult.recommend_tests || jsonResult.recommend_text_resources,
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
function* getTextDetailSource(action) {
	try {
		const { jsonResult } = yield call(req.getTextDetail, action);
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

function* getTextDetailListSource(action) {
	try {
		const { jsonResult } = yield call(req.getTextDetailList, action);
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

function* postTextDetailCommentSource(action) {
	try {
		const { jsonResult } = yield call(req.postTextDetailComment, action);
		if (jsonResult) {
			message.success(jsonResult.status);
			yield put({
				type: 'text/get/comment',
				id: action.id,
				pagination: 1
			})
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'text/get/failed/recommend',
		//   err,
		// });
	}
}

function* deleteTextDetailCommentSource(action) {
	try {
		const { jsonResult } = yield call(req.deleteTextDetailComment, action);
		if (jsonResult) {
			message.success('删除成功');
			yield put({
				type: 'text/get/comment',
				id: action.id,
				pagination: 1
			})
			yield put({
				type: 'user/get/userTextComment',
				pagination: 1
			})
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
