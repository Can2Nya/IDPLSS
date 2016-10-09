import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

import { data } from '../services/user.js';//向user传送的数据

const user = handleActions({
	['user/login'](state, action) {
		data['user_id'] = action.userId;
		console.log(data)
		return { ...state, isloginFormSubmit: true }
	},
	['user/login/success'](state, action) {//登录成功获取用户信息
	  	return { ...state, list: action.payload, isloginFormSubmit: false, modalState: false, };
	},
	['user/login/failed'](state, action) {
	  	return { ...state, list: [], isloginFormSubmit: false };
	},
	['user/login/modal/toggle'](state, action) {
		return { ...state, modalState: !action.modalState, isloginFormSubmit: false };
	},

	['user/logout'](state, action){
		//const newList = list.clear()
		return { ...state, list: [] };
	},
	// ---------------------------------------------------
	['user/register'](state, action) {
		return { ...state, isregisterFormSubmit: true }
	},
	['user/register/success'](state, action) {
		return { ...state, isregisterFormSubmit: false, stepState: 2 }
	},
	['user/register/failed'](state, action) {
		return { ...state, isregisterFormSubmit: false }
	},
	// 
	['user/register/confirm'](state, action) {
		data['code'] = action.code
		return { ...state, isregisterConfirm: true, stepState: 3 }
	},
	['user/register/confirm/success'](state, action) {
		return { ...state, isregisterConfirm: false, success: true }
	},
	['user/register/confirm/failed'](state, action) {
		return { ...state, isregisterConfirm: false, err: action.err }
	},
	// ---------------------------------------------------
	['user/register/stepState'](state, action) {
		return { ...state, isAllowStepChange:false, stepState: action.stepState }
	},
	['user/register/allowStepChange'](state, action) {
		return { ...state, isAllowStepChange: action.isAllowStepChange }
	},
	// ---------------------------------------------------
	['user/info/get'](state, action){
		return { ...state }
	},
	['user/info/set'](state, action){
		return { ...state }
	},
	['user/info/isFollowing'](state, action){//判断当前用户是否关注某用户
		return { ...state }
	},
	['user/info/isFollowedBy'](state, action){//判断当前用户是否关注某用户
		return { ...state }
	},
}, {
	list: [],//用户信息
	modalState: false,//modal是否被激活
	stepState: 0,//注册步骤状态
	isAllowStepChange: false,//可以允许改变步骤
	isloginFormSubmit: false,//login表单是否被提交【这名字咱要改惹
	isregisterFormSubmit: false,//register表单是否被提交
	isregisterConfirm: false,//是否邮箱严重成功
});

export default user;