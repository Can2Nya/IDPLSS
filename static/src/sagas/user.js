import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';

import { message } from 'antd';

import { getUserState, setUserState, UserisFollowing, UserisFollowedBy, userRegister  } from '../services/user';
//import * from '../services/user';

function* getUser() {
  try {
    const { jsonResult } = yield call(getUserState);
    if (jsonResult) {
      yield put({
        type: 'user/login/success',
        payload: jsonResult,
      });
    }
  } catch (err) {
    message.error(err);
    yield put({
      type: 'user/login/failed',
    });
  }
}

function* setUser() {
  try {
    const { jsonResult } = yield call(setUserState);
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

function* register() {
  try {
    const { jsonResult } = yield call(userRegister);
    if (jsonResult) {
      yield put({
        type: 'user/register/success',
      });
      yield put({
        type: 'user/register/stepState',
        stepState: 4
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

function* isFollowing() {
  try {
    const { jsonResult } = yield call(UserisFollowing);
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

function* isFollowedBy() {
  try {
    const { jsonResult } = yield call(UserisFollowedBy);
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



function* watchUserGet() {
  yield* takeLatest(['user/login','user/info/get'], getUser)
}

function* watchUserSet() {
  yield* takeLatest('user/info/set', setUser)
}
function* watchUserRegister() {
  yield* takeLatest('user/register', register)
}
function* watchisFollowing() {
  yield* takeLatest('user/info/isFollowing', isFollowing)
}
function* watchisFollowedBy() {
  yield* takeLatest('user/info/isFollowedBy', isFollowedBy)
}

/*function* watchUserGetJson() {
  yield* takeLatest(['user/login','user/getInfo','user/register'], getJson)
}*/

export default function* () {
  yield fork(watchUserGet);
  yield fork(watchUserSet);
  yield fork(watchUserRegister);
  yield fork(watchisFollowing);
  yield fork(watchisFollowedBy);
  //yield fork(watchUserGetJson)
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
