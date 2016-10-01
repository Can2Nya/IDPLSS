import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';

import { message } from 'antd';

import { getUserState, setUserState, UserisFollowing, UserisFollowedBy  } from '../services/user';

function* getUser() {
  try {
    const { jsonResult } = yield call(getUserState);
    console.log(jsonResult)
    if (jsonResult) {
      yield put({
        type: 'user/login/success',
        payload: jsonResult,
      });
    }
  } catch (err) {
    message.error(err);
    //yield put({
    //  type: 'user/login/failed',
    //  err,
    //});
  }
}

function* setUser() {
  try {
    const { jsonResult } = yield call(setUserState);
    if (jsonResult.data) {
      //yield put({
        //type: 'user/login/success',
        //payload: jsonResult.data,
      //});
      console.log(jsonResult.data)
    }
  } catch (err) {
    message.error(err);
    //yield put({
    //  type: 'user/login/failed',
    //  err,
    //});
  }
}

function* isFollowing() {
  try {
    const { jsonResult } = yield call(UserisFollowing);
    if (jsonResult.data) {
      //yield put({
        //type: 'user/login/success',
        //payload: jsonResult.data,
      //});
      console.log(jsonResult.data)
    }
  } catch (err) {
    message.error(err);
    //yield put({
    //  type: 'user/login/failed',
    //  err,
    //});
  }
}

function* isFollowedBy() {
  try {
    const { jsonResult } = yield call(UserisFollowedBy);
    if (jsonResult.data) {
      //yield put({
        //type: 'user/login/success',
        //payload: jsonResult.data,
      //});
      console.log(jsonResult.data)
    }
  } catch (err) {
    message.error(err);
    //yield put({
    //  type: 'user/login/failed',
    //  err,
    //});
  }
}

function* watchUserGet() {
  yield* takeLatest(['user/login','user/getInfo'], getUser)
}

function* watchUserSet() {
  yield* takeLatest('user/info/set', setUser)
}
function* watchisFollowing() {
  yield* takeLatest('user/info/isFollowing', isFollowing)
}
function* watchisFollowedBy() {
  yield* takeLatest('user/info/isFollowedBy', isFollowedBy)
}

export default function* () {
  yield fork(watchUserGet);
  yield fork(watchUserSet);
  yield fork(watchisFollowing);
  yield fork(watchisFollowedBy);
  // Load user.//
  yield put({
    type: 'user/login',//默认会触发的事件
  });
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
