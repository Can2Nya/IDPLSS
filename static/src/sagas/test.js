import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import * as req from '../services/test';
import { message, Modal, Progress } from 'antd';

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
		const { jsonResult } = yield call(req.getTestRecommend, action);
		if (jsonResult) {
			yield put({
				type: 'test/get/success/recommend',
				payload: jsonResult.recommend_tests || jsonResult.recommend_tests,
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
				payload: jsonResult.problem_list || jsonResult.problems,
				count: jsonResult.count
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

function* TestAnswer(action) {
	try {
		const { jsonResult } = yield call(req.TestAnswer, action);
		if (jsonResult) {
			if(action.type == "test/post/problemResult"){
				let newStatus;
				if(jsonResult.status == 'True') newStatus = true;
				if(jsonResult.status == 'False') newStatus = false;
				yield put({
					type: 'test/post/success/problemResult',
					payload: {index: action.index, status: newStatus}
				})

				if(action.index == action.total){
					yield put({
						type: 'test/get/problemResult',
						// id: action.test_record_id
						id: action.body.test_id
					});
				}
				
			}
			if (action.type == 'test/get/problemResult') {
				yield put({
					type: 'test/get/success/problemResult',
					accuracy: jsonResult.accuracy
				});
				Modal.success({
					title: '您的答题正确率',
					content: `${jsonResult.accuracy * 100}%`
					// content: <Progress type="circle" percent={jsonResult.accuracy * 100} />
				});
			};
		}
	} catch (err) {
		message.error(err);
		// yield put({
		//   type: 'test/get/failed/recommend',
		//   err,
		// });
	}
}

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
function* watchTestAnswer() {
	yield takeEvery(["test/post/problemResult",'test/get/problemResult'], TestAnswer)
}

export default function* () {
	yield fork(watchTestCategorySourceGet);
	yield fork(watchTestRecommendGet)
	yield fork(watchTestDetailGet)
	yield fork(watchTestDetailListGet)
	// yield fork(watchTestDetailCommentPost)
	// yield fork(watchTestDetailCommentDelete)
	yield fork(watchTestAnswer)
	// Load test.
	//yield put({
	//	type: 'test/get/categorySource',

	//});
}
