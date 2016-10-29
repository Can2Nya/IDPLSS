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
	['upload/changeEditState'](state, action) {
		return { ...state, isEdit: action.isEdit };
	},
	['upload/changeModalState'](state, action) {
		return { ...state, modalState: action.modalState };
	},
}, {
	files: [],
	token: '',
	modalState: false,//modal是否被激活
	progress: [], //可为object
	isSelectMenuItem: '1',
	isEdit: false, // ture为进入编辑页面
});

export default upload;