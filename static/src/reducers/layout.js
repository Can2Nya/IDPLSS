import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const layout = handleActions({
	['layout/replace'](state, action) {
		let newLayoutid;
	  state.list.map(layoutList => {
	    layoutList.pathname.map(layoutPath => {
	        if(state.location.pathname.search(layoutPath) != -1) {
	          newLayoutid = layoutList.id;
	        }
	      }
	    );
	  });
	  console.log(state);
	  return { ...state, layoutId: newLayoutid };
	},
}, {
	list: [
		{
			id: 1,
			pathname: ['/','index'],
		},
		{
			id: 2,
			pathname: ['category','detail','search','bbs']
		},
		{
			id: 3,
			pathname: ['play','user']
		},
	],
	layoutId: 0,
});

export default layout;