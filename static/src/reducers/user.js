import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const user = handleActions({
	['user/login'](state, action) {
		return { ...state, loginFormisSubmit: true }
	},
	['user/login/success'](state, action) {//登录成功获取用户信息
	  	return { ...state, list: action.payload, loginFormisSubmit: false, modalState: false, };
	},
	['user/login/failed'](state, action) {
	  	return { ...state, list: [], loginFormisSubmit: false };
	},
	['user/login/modal/toggle'](state, action) {
		return { ...state, modalState: !action.modalState, loginFormisSubmit: false };
	},

	['user/logout'](state, action){
		//const newList = list.clear()
		return { ...state, list: [] };
	},

	['user/register'](state, action) {
		return { ...state, registerFormisSubmit: true }
	},
	['user/register/success'](state, action) {
		return { ...state, registerFormisSubmit: false, isAllowStepChange:true }
	},
	['user/register/failed'](state, action) {
		return { ...state, registerFormisSubmit: false }
	},
	['user/register/stepState'](state, action) {
		return { ...state, isAllowStepChange:false, stepState: action.stepState }
	},
	['user/register/allowStepChange'](state, action) {
		return { ...state, isAllowStepChange: action.isAllowStepChange }
	},
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
	loginFormisSubmit: false,//login表单是否被提交【这名字咱要改惹
	registerFormisSubmit: false,//register表单是否被提交
});

export default user;