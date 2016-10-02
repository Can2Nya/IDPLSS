import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const videos = handleActions({
	['videos/get'](state, action) {
	   return { ...state, loading: true };
	},
	['videos/get/success'](state, action) {
		return { ...state, list: action.payload, loading: false }
	},
	['videos/get/failed'](state, action) {
		return { ...state, err: action.err, loading: false }
	},
	/**['videos/changeMode'](state, action) {
		/**模式有主页展示，推荐模式，分类展示
		const newMode = action.mode;
		return { ...state, mode: newMode }
	},**/
}, {
	list: [{
		id: 1,
		tab: 1,
	},{
		id: 2,
		tab: 2,
	},{
		id: 3,
		tab: 3,
	},{
		id: 4,
		tab: 1,
	},{
		id: 5,
		tab: 7,
	},{
		id: 6,
		tab: 5,
	},{
		id: 7,
		tab: 4,
	}],
});

export default videos;