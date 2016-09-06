import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const user = handleActions({
	['user/get'](state, action) {
	  	return { ...state };
	},
	['user/modal/toggle'](state, action) {
		return { ...state, modalState: !action.modalState, isSubmit: false };
	},
	['user/modal/submit'](state, action) {
		return { ...state, list:[{}], isSubmit: !action.isSubmit }
	}
}, {
	list: [],
	modalState: false,
	isSubmit: false,
});

export default user;