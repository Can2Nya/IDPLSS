import { handleActions } from 'redux-actions';
import { combineReducer, subscriptions } from 'redux';

import { data } from '../services/forum.js';//向forum传送的数据

const forum = handleActions({
	['forum/init/categorySource'](state, action){
		return{ ...state, loading: true }
	},
	['forum/init/commplete/categorySource'](state, action){
		return{ ...state, isSelectCategory: action.category, isSelectPagination: action.pagination, loading: false}
	},
	['forum/get/categorySource'](state, action) {
		data['category'] = state.isSelectCategory - 1;
		data['pagination'] = state.isSelectPagination;
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: true, },
		};
	},
	['forum/get/success/categorySource'](state, action) {
		return { 
			...state,
			categorySource: { ...state.categorySource, list: action.payload.posts, loading: false },
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
			recommend: { ...state.recommend, list: action.payload.posts, loading: false },
			total: action.payload.count,
		}
	},
	['forum/get/failed/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: false, },
		};
	},
	// -----------详细列表--------------------------------------------
	['forum/init/detail'](state, action) {
		// data['fuc'] = action.fuc
		data['coursesId'] = action.id
		return { 
		...state, 
		isSelectContext: { ...state.isSelectContext, id: action.id, loading: true, },
		};
	},
	['forum/get/detail'](state, action) {//获取有关联的列表
		return { 
		...state, 
		isSelectContext: { ...state.isSelectContext, loading: true, },
		};
	},
	['forum/get/success/detail'](state, action) {
		return { 
			...state,
			isSelectContext: { ...state.isSelectContext, context: action.payload, loading: false },
		}
	},
	// ['forum/get/series'](state, action) {//获取有关联的列表
	// 	console.log('series')
	// 	return { 
	// 	...state, 
	// 	isSelectContext: { ...state.isSelectContext, loading: true, },
	// 	};
	// },
	// ['forum/get/success/series'](state, action) {
	// 	return { 
	// 		...state,
	// 		isSelectContext: { ...state.isSelectContext, list: action.payload.courses, loading: false },
	// 	}
	// },
	['forum/get/comment'](state, action) {//获取有关联的列表
		return { 
		...state, 
		isSelectContext: { ...state.isSelectContext, loading: true, },
		};
	},
	['forum/get/success/comment'](state, action) {
		return { 
			...state,
			isSelectContext: { ...state.isSelectContext, comment: action.payload.posts, loading: false },
		}
	},
	['forum/post/comment'](state, action) {
		data['body'] = { body: action['body'], author_id: action['author_id'], course_id: action['id']}
		return { ...state,}
	},
	['forum/delete/comment'](state, action) {
		
		return { ...state,}
	},
	/**['forum/changeMode'](state, action) {
		/**模式有主页展示，推荐模式，分类展示
		const newMode = action.mode;
		return { ...state, mode: newMode }
	},**/
	// ---------------------------------------------------------------
	['forum/changeCategory'](state, action) {
		return { ...state, isSelectCategory: action.isSelectCategory }
	},
	['forum/changePagination'](state, action) {
		return { ...state, isSelectPagination: action.isSelectPagination }
	},
	['forum/ToggleForumModal'](state, action) {
		return { ...state, modalState: !action.modalState }
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
			 '互联网/计算机',
			 '基础科学',
			 '工程技术',
			 '历史哲学',
			 '经管法律',
			 '语言文学',
			 '艺术音乐',
			 '兴趣生活',
			 ],
	modalState: false,
	isSelectCategory: 0,//选定的分类，没选定就是分类的7
	isSelectPagination: 1,//选定的分页，默认从1开始
	isSelectContext: {
		id: 0,
		context: {},//描述内容【detail
		comment: [],//课程评论列表
	},//选定的内容
	loading: false,//加载中
});

export default forum;