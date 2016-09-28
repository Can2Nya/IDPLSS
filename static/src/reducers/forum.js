import { handleActions } from 'redux-actions';
import { combineReducer, subscriptions } from 'redux';

//import { data } from '../services/forum.js';//向forum传送的数据

const forum = handleActions({
	['forum/init'](state, action){
		return{ ...state, loading: true }
	},
	['forum/init/commplete'](state, action){
		return{ ...state, isSelectCategory: action.category, isSelectPagination: action.pagination, loading: false}
	},
	['forum/get/categorySource'](state, action) {
		//data['category'] = state.isSelectCategory;
		//data['pagination'] = state.isSelectPagination;
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: true, },
		};
	},
	['forum/get/success/categorySource'](state, action) {
		return { 
			...state,
			categorySource: { ...state.categorySource, list: action.payload.courses_forum, loading: false },
			total: action.payload.count,
		}
	},
	['forum/get/failed/categorySource'](state, action) {
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: false, },
		};
	},

	['forum/get/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: true, },
		};
	},
	['forum/get/success/recommend'](state, action) {
		return { 
			...state,
			recommend: { ...state.recommend, list: action.payload.courses_forum, loading: false },
			total: action.payload.count,
		}
	},
	['forum/get/failed/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: false, },
		};
	},
	/**['forum/changeMode'](state, action) {
		/**模式有主页展示，推荐模式，分类展示
		const newMode = action.mode;
		return { ...state, mode: newMode }
	},**/
	['forum/changeCategory'](state, action) {
		return { ...state, isSelectCategory: action.isSelectCategory }
	},
	['forum/changePagination'](state, action) {
		return { ...state, isSelectPagination: action.isSelectPagination }
	},
}, {
	stateName: 'forum',
		categorySource: {//分页中的列表
			list:[],
			loading: false,
		},
		recommend: {//主页，推荐栏列表
			list:[],
			loading: false,
		},//看api分类
	total: 0,//数据总数
	categoryTitle: '板块分类',
	category: [
			 '全部板块',
			 '学习',
			 '娱乐',
			 '意见反馈',
			 ],
	isSelectCategory: 0,//选定的分类，没选定就是分类的7
	isSelectPagination: 1,//选定的分页，默认从1开始
	loading: false,//加载中
});

export default forum;