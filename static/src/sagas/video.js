import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { getVideoList } from '../services/video';
import { message } from 'antd';

function* getVideoCategorySource() {
	try {
		const { jsonResult } = yield call(getVideoList);
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
function* getVideoRecommendSource() {
	try {
		const { jsonResult } = yield call(getVideoList);
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

function* watchVideoCategorySourceGet() {
	yield takeLatest('video/get/categorySource', getVideoCategorySource)
	
}
function* watchVideoRecommendGet() {
	yield takeLatest('video/get/recommend', getVideoRecommendSource)
}

export default function* () {
	yield fork(watchVideoCategorySourceGet);
	//yield fork(watchVideoRecommendGet)
	// Load video.
	//yield put({
	//	type: 'video/get/categorySource',

	//});
}
