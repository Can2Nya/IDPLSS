import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const upload = handleActions({
	// redux-saga返回的数据 在user中处理
	['upload/get/token'](state, action) {
	  return { ...state };
	},
	['upload/get/success/token'](state, action) {
		return { ...state, token: action.payload };
	},
	['upload/drop'](state, action) {
		return { ...state, files: action.files };
		// return { ...state, files: [action.file, ...state.files ] };
	},
	['upload/setProgress'](state, action) {
		return { ...state, token: action.payload };
	},
}, {
	files: [],
	token: '',
	progress: 0,
});

export default upload;