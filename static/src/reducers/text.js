import { handleActions } from 'redux-actions';
import { combineReducer, subscriptions } from 'redux';

import { data } from '../services/text.js';//向text传送的数据

const text = handleActions({
	['text/init/categorySource'](state, action){
		return{ ...state, loading: true }
	},
	['text/init/commplete/categorySource'](state, action){
		return{ ...state, isSelectCategory: action.category, isSelectPagination: action.pagination, loading: false}
	},
	['text/get/categorySource'](state, action) {
		data['category'] = state.isSelectCategory - 1;
		data['pagination'] = state.isSelectPagination;
		data['type'] = state.isSelectType;
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: true, },
		};
	},
	['text/get/success/categorySource'](state, action) {
		return { 
			...state,
			categorySource: { ...state.categorySource, list: action.payload.text_resources, loading: false },
			total: action.payload.count,
		}
	},
	['text/get/failed/categorySource'](state, action) {
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: false, },
		};
	},

	['text/get/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: true, },
		};
	},
	['text/get/success/recommend'](state, action) {
		return { 
			...state,
			recommend: { ...state.recommend, list: action.payload.text_resources, loading: false },
			total: action.payload.count,
		}
	},
	['text/get/failed/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: false, },
		};
	},
	// -----------详细列表--------------------------------------------
	['text/init/detail'](state, action) {
		data['fuc'] = action.fuc
		data['coursesId'] = action.id
		return { 
		...state, 
		isSelectContext: { ...state.isSelectContext, id: action.id, loading: true, },
		};
	},
	['text/get/detail'](state, action) {//获取有关联的列表
		return { 
		...state, 
		isSelectContext: { ...state.isSelectContext, loading: true, },
		};
	},
	['text/get/success/detail'](state, action) {
		return { 
			...state,
			isSelectContext: { ...state.isSelectContext, context: action.payload, loading: false },
		}
	},
	// ['text/get/series'](state, action) {//获取有关联的列表
	// 	console.log('series')
	// 	return { 
	// 	...state, 
	// 	isSelectContext: { ...state.isSelectContext, loading: true, },
	// 	};
	// },
	// ['text/get/success/series'](state, action) {
	// 	return { 
	// 		...state,
	// 		isSelectContext: { ...state.isSelectContext, list: action.payload.courses, loading: false },
	// 	}
	// },
	['text/get/comment'](state, action) {//获取有关联的列表
		return { 
		...state, 
		isSelectContext: { ...state.isSelectContext, loading: true, },
		};
	},
	['text/get/success/comment'](state, action) {
		return { 
			...state,
			isSelectContext: { ...state.isSelectContext, comment: action.payload.posts, loading: false },
		}
	},
	['text/post/comment'](state, action) {
		data['body'] = { body: action['body'], author_id: action['author_id'], course_id: action['id']}
		return { ...state,}
	},
	['text/delete/comment'](state, action) {
		
		return { ...state,}
	},
	/**['text/changeMode'](state, action) {
		/**模式有主页展示，推荐模式，分类展示
		const newMode = action.mode;
		return { ...state, mode: newMode }
	},**/
	// 
	['text/changeCategory'](state, action) {
		return { ...state, isSelectCategory: action.isSelectCategory }
	},
	['text/changePagination'](state, action) {
		return { ...state, isSelectPagination: action.isSelectPagination }
	},
	['text/changeType'](state, action) {
		return { ...state, isSelectType: action.isSelectType }
	},
}, {
	stateName: 'text',
		categorySource: {//分页中的列表
			list:[],
			loading: false,
		},
		recommend: {//主页，推荐栏列表
			list:[],
			loading: false,
		},//看api分类
	total: 0,//数据总数
	categoryTitle: '文库分类',
	category: [
			'全部文库',
			 '互联网/计算机',
			 '基础科学',
			 '工程技术',
			 '历史哲学',
			 '经管法律',
			 '语言文学',
			 '艺术音乐',
			 
			 ],
	isSelectCategory: 0,//选定的分类，没选定就是分类的1
	isSelectPagination: 1,//选定的分页，默认从1开始
	isSelectType: -1,//选定的文档类型，默认全部（-1）
	isSelectContext: {
		id: 0,
		context: {},
		list: [],
		comment: [],//课程评论列表
	},//选定的内容
	loading: false,//加载中
});

export default text;