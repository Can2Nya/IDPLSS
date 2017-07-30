import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';
import cookie from 'js-cookie';

// import { data } from '../services/user.js';//向user传送的数据

const user = handleActions({
	// 登录，获取用户信息------------------------------------

	['user/login'](state, action) {
		// 触发此action需要body
		return { ...state, isloginFormSubmit: true }
	},
	['user/login/success'](state, action) {//登录成功获取用户id
		cookie.set('user_id', action.payload.user_id);
		return { 
			...state, 
			// loginUserList: { ...state.loginUserList, user_id: action.payload.user_id }, 
			isloginFormSubmit: false, modalState: false, };
	},
	['user/login/failed'](state, action) {
		cookie.remove('authorization')
		cookie.remove('user_id')
		return { ...state, isloginFormSubmit: false };
	},
	['user/get/loginInfo'](state, action){
		// 触发此action需要user_id
		// data['user_id'] = cookie.get('user_id')
		return { ...state }
	},
	['user/get/success/loginInfo'](state, action){
		return { 
	  		...state, 
	  		loginUserList: action.payload, 
	  	};
	},
	['user/get/info'](state, action){
		// 触发此action需要user_id
		// data['user_id'] = action.user_id
		return { ...state }
	},
	['user/get/success/info'](state, action){
		return { 
	  		...state, 
	  		userList: action.payload, 
	  	};
	},
	['user/login/modal/toggle'](state, action) {
		return { ...state, modalState: action.modalState, isloginFormSubmit: false };
	},
	['user/repsd/modal/toggle'](state, action) {
		return { ...state, repsd: action.repsd, isloginFormSubmit: false };
	},
	['user/logout'](state, action){
		cookie.remove('authorization')
		cookie.remove('user_id')
		return { ...state, loginUserList: [] };
	},
	// ------------------注册------------------------------
	// ---------------------------------------------------
	['user/register'](state, action) {
		// 触发此action需要body
		return { ...state, isregisterFormSubmit: true }
	},
	['user/register/success'](state, action) {
		return { ...state, isregisterFormSubmit: false, stepState: 2 }
	},
	['user/register/failed'](state, action) {
		return { ...state, isregisterFormSubmit: false }
	},
	// --------------------------------------------------
	['user/register/confirm'](state, action) {
		// 触发此action需要confirm_code
		// data['code'] = action.code
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
	// -----------------------end----------------------------
	
	// ['user/transfer/loginInfo'](state, action){//将已登录信息转移到这里
	// 	const { userList } = state
	// 	if(userList.user_id == cookie.get('user_id')){
	// 		console.log('changeuser')
	// 		return { 
	// 			...state,
	// 			loginUserList: userList
	// 		}
	// 	}
	// 	return { ...state }
	// },
	// --用户中心-----------------------------------------------
	['user/set/info'](state, action){// 设置用户信息
		// 修改用户信息：user_id,body（必须
		// 修改密码模式：mode: setpassword,body,token
		// 发送邮件查找密码：mode: email，body
		// 重新邮箱激活：mode: recomfirm,body
		return { ...state }
	},
	['user/get/passwordToken'](state, action){
		return { ...state, psdtoken: action.psdtoken }
	},
	// 以下action需要pagination 字段
	['user/get/userPost'](state, action){// 获取用户帖子
		return { ...state, loading: true, userZoneList: [] }
	},
	['user/get/userPostComment'](state, action){// 获取用户帖子的评论
		return { ...state, loading: true, userZoneList: [] }
	},
	['user/get/userPostCollection'](state, action){// 获取用户收藏帖子
		return { ...state, loading: true, userZoneList: [] }
	},

	['user/get/userVideo'](state, action){
		return { ...state, loading: true, userZoneList: [] }
	},
	['user/get/userVideoList'](state, action){
		return { ...state, loading: true, userZoneSubList: [] }
	},
	['user/get/userVideoComment'](state, action){
		return { ...state, loading: true, userZoneList: [] }
	},
	['user/get/userVideoCollection'](state, action){
		return { ...state, loading: true, userZoneList: [] }
	},

	['user/get/userText'](state, action){
		return { ...state, loading: true, userZoneList: [] }
	},
	['user/get/userTextComment'](state, action){
		return { ...state, loading: true, userZoneList: [] }
	},
	['user/get/userTextCollection'](state, action){
		return { ...state, loading: true, userZoneList: [] }
	},

	['user/get/userTest'](state, action){
		return { ...state, loading: true, userZoneList: [] }
	},
	['user/get/userTestList'](state, action){
		return { ...state, loading: true, userZoneSubList: [] }
	},
	['user/get/userTestComplete'](state, action){
		return { ...state, loading: true, userZoneList: [] }
	},

	['user/get/zoneData/success'](state, action){
		return { ...state, userZoneList: action.payload, total: action.total, loading: false }
	},
	['user/get/zoneSubData/success'](state, action){
		return { ...state, userZoneSubList: action.payload, total: action.total, loading: false }
	},
	['user/post/isFollowing'](state, action){//判断当前用户是否关注某用户
		return { ...state }
	},
	['user/post/isFollowedBy'](state, action){//判断当前用户是否关注某用户
		return { ...state }
	},
	['user/changeSelectTab'](state, action){
		return { ...state, isSelectTab: action.isSelectTab }
	},
	['user/changeSelectSubTab'](state, action){
		return { ...state, isSelectSubTab: action.isSelectSubTab }
	},
	// ---用户推荐----------------
	['user/get/videoRecommend'](state, action){
		return { ...state }
	},
	['user/get/textRecommend'](state, action){
		return { ...state }
	},
	['user/get/testRecommend'](state, action){
		return { ...state }
	},
	['user/get/recommend/success'](state, action){
		return { ...state, recommend: action.payload }
	},
	['user/get/stat'](state, action){
		// mode: 时间频率frequency，学习领域interested-field, 云词：cloud
		return { ...state }
	},
	['user/get/stat/success'](state, action){
		// mode: 时间频率frequency，学习领域interested-field
		if(action.mode == 'frequency') return { ...state, barData: action.payload }
		if(action.mode == 'interestedField') return { ...state, radarData: action.payload }
		if(action.mode == 'cloud') return { ...state, cloudData: action.payload }
		return { ...state }
	},
	// -------内容------------------
	['user/init/collect'](state, action){
		// context: Video,Text,test
		return { ...state, isCollectContext: false }
	},
	['user/get/collect'](state, action){
		// context: Video,Text,test
		return { ...state }
	},
	['user/set/collect'](state, action){
		// 触发需要method：get，delete,post(创建测试使用)
		// context: video,text,test
		return { ...state }
	},
	['user/replace/collect'](state, action){
		// 触发需要method：get(用于清除测试数据)
		// id为清除的测试记录
		// context: test
		return { ...state }
	},
	['user/set/collect/success'](state, action){
		
		if(typeof(action.payload) != "boolean"){
			let newStatus;
			if(action.payload == 'True') newStatus = true;
			if(action.payload == 'False') newStatus = false;
			return { ...state, isCollectContext: newStatus }
		}
		else{
			return { ...state, isCollectContext: action.payload }
		}
	},
	['user/get/like'](state, action){
		// context: video,text,test,post
		return { ...state }
	},
	// ----------搜索-----------------
	['user/get/search'](state, action){
		// 触发需要
		// context: video,text,test,post
		const cata = {'video':'0','text':'1','test':'2','post':'3'}
		return { ...state, keyWord: action.body.key_words, loading: true, isSelectMenuItem: cata[action.context] }
	},
	['user/get/search/success'](state, action){
		// context: Video,Text,test
		return { ...state, searchList: action.payload, total: action.count, loading: false }
	},
	['user/changeMenuItem'](state, action){
		return { ...state, isSelectMenuItem: action.isSelectMenuItem }
	},
}, {
	psdtoken: null,// 重设密码的token
	loginUserList: [],// 已登录信息(自己的信息)
	userList: [],//用户信息(别人的)
	modalState: false,//modal是否被激活
	repsd: false,//找回密码模式
	stepState: 0,//注册步骤状态
	isAllowStepChange: false,//可以允许改变步骤
	isloginFormSubmit: false,//login表单是否被提交
	isregisterFormSubmit: false,//register表单是否被提交
	isregisterConfirm: false,//是否邮箱验证成功
	isCollectContext: false,//是否参加内容【课程／文本／测试】

	isSelectTab: '0',// user zone一级菜单
	isSelectSubTab: '0', // user zone 二级菜单
	total: 0,// 下面两个列表的中内容的总数【不是两个列表加起来的
	userZoneList: [],// 通用存放数据list
	userZoneSubList: [], // 二级数据存放【例如videolist，problemlist
	recommend: [],// 用户自己接收的推荐
	barData: [],// 条形图数据
	radarData: [],// 雷达图
	cloudData: [], // 云词
	// 搜索
	isSelectMenuItem: '0', // 选择分类
	keyWord: '',// 搜索关键子
	searchList: [],//  搜索返回结果
	loading: false,// 
});

export default user;