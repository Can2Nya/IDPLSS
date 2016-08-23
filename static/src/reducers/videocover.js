import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const videocover = handleActions({
	['videocover/get'](state, action) {
	  return { ...state, videocoverId: newLayoutid };
	},
}, {
	list: [{},{},{}
	]
});

export default videocover;