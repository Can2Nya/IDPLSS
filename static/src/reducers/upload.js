import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const upload = handleActions({
	
	['upload/drop'](state, action) {
		return { ...state, files: action.files };
		// return { ...state, files: [action.file, ...state.files ] };
	},
	['upload/multiplyPlus'](state, action) {
		return { ...state, files: [ ...state.files, action.files] };
		// return { ...state, files: [action.file, ...state.files ] };
	},
	['upload/multiplyDelete'](state, action) {
		const newList = state.files.filter(file => file.lastModified != action.lastModified)
		return { ...state, files: newList };
	},
	// ------------saga---------------------
	// redux-saga返回的数据 在user中处理
	['upload/get/token'](state, action) {
	  return { ...state };
	},
	['upload/get/success/token'](state, action) {
		return { ...state, token: action.payload };
	},

	['upload/get/userVideo'](state, action) {
	  return { ...state, loading: true, isSelectContext: {} };
	},
	['upload/get/userText'](state, action) {
	  return { ...state, loading: true, isSelectContext: {} };
	},
	['upload/get/userTest'](state, action) {
	  return { ...state, loading: true, isSelectContext: {} };
	},
	['upload/get/success/isSelectContext'](state, action) {
		return { ...state, isSelectContext: action.payload, loading: false };
	},

	['upload/get/userVideoList'](state, action) {
	  return { ...state, loading: true, isSelectContextList: [] };
	},
	['upload/get/userTextList'](state, action) {
	  return { ...state, loading: true, isSelectContextList: [] };
	},
	['upload/get/userTestList'](state, action) {
	  return { ...state, loading: true, isSelectContextList: [] };
	},
	['upload/get/success/isSelectContextList'](state, action) {
		return { ...state, isSelectContextList: action.payload, loading: false };
	},

	['upload/post/createCourse'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/post/createVideo'](state, action) {// 二级数据
		return { ...state, };
	},
	['upload/post/createText'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/post/createTest'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/post/createProblem'](state, action) {// 二级数据
		return { ...state, };
	},
	['upload/put/createCourse'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/put/createVideo'](state, action) {// 二级数据
		return { ...state, };
	},
	['upload/put/createText'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/put/createTest'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/put/createProblem'](state, action) {// 二级数据
		return { ...state, };
	},
	// --------------状态-------------------
	['upload/init'](state, action) {
		return { ...state, files: [] };
	},
	['upload/setProgress'](state, action) {
		return { ...state, progress: action.progress };
	},
	['upload/changeMenuItem'](state, action) {
		return { ...state, isSelectMenuItem: action.item };
	},
	['upload/changeEditState'](state, action) {// 顺便带上选择内容的id
		return { ...state, isEdit: action.isEdit, isSelectContextId: action.isSelectContextId };
	},
	['upload/changeModalState'](state, action) {
		return { ...state, modalState: action.modalState };
	},
}, {
	files: [],
	token: '',
	modalState: false,//modal是否被激活
	loading: false,
	progress: 0, //可为arayy或int
	isSelectMenuItem: '1',
	isEdit: false, // ture为进入编辑页面
	isSelectContextId: 0,// 选择的内容【课程／资料／测试】的id
	isSelectContext: {},// 选择的内容
	isSelectContextList: [],// 视频，问题
});

export default upload;