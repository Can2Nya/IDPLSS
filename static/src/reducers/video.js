import { handleActions } from 'redux-actions';
import { combineReducer, subscriptions } from 'redux';

import { data } from '../services/video.js';//向video传送的数据

const video = handleActions({
	['video/init'](state, action){
		return{ ...state, loading: true }
	},
	['video/init/commplete'](state, action){
		return{ ...state, isSelectCategory: action.category, isSelectPagination: action.pagination, loading: false }
	},
	['video/get/categorySource'](state, action) {
		data['category'] = state.isSelectCategory;
		data['pagination'] = state.isSelectPagination;
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: true, },
		};
	},
	['video/get/success/categorySource'](state, action) {
		return { 
			...state,
			categorySource: { ...state.categorySource, list: action.payload.courses_video, loading: false },
			total: action.payload.count,
		}
	},
	['video/get/failed/categorySource'](state, action) {
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: false, },
		};
	},

	['video/get/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: true, },
		};
	},
	['video/get/success/recommend'](state, action) {
		return { 
			...state,
			recommend: { ...state.recommend, list: action.payload.courses_video, loading: false },
			total: action.payload.count,
		}
	},
	['video/get/failed/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: false, },
		};
	},
	/**['video/changeMode'](state, action) {
		/**模式有主页展示，推荐模式，分类展示
		const newMode = action.mode;
		return { ...state, mode: newMode }
	},**/
	['video/changeCategory'](state, action) {
		return { ...state, isSelectCategory: action.isSelectCategory }
	},
	['video/changePagination'](state, action) {
		return { ...state, isSelectPagination: action.isSelectPagination }
	},
}, {
	stateName: 'video',
		categorySource: {//分页中的列表
			list:[],
			loading: false,
		},
		recommend: {//主页，推荐栏列表
			list:[],
			loading: false,
		},//装载视频内容，看api分类
	total: 0,//数据总数
	categoryTitle: '视频分类',
	category: [
			'全部视频',
			 '互联网/计算机',
			 '基础科学',
			 '工程技术',
			 '历史哲学',
			 '经管法律',
			 '语言文学',
			 '艺术音乐',
			 
			 ],
	isSelectCategory: 0,//选定的分类，没选定就是分类的7
	isSelectPagination: 1,//选定的分页，默认从1开始
	loading: false,//加载中
});

export default video;