import { handleActions } from 'redux-actions';
import { combineReducer, subscriptions } from 'redux';

import { data } from '../services/video.js';//向video传送的数据

const video = handleActions({
	['video/init/categorySource'](state, action){
		return{ ...state, loading: true }
	},
	['video/init/commplete/categorySource'](state, action){
		return{ ...state, isSelectCategory: action.category, isSelectPagination: action.pagination, loading: false }
	},
	// -------------------------------------------------------
	['video/get/categorySource'](state, action) {
		data['category'] = state.isSelectCategory -1;
		data['pagination'] = state.isSelectPagination;
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: true, },
		};
	},
	['video/get/success/categorySource'](state, action) {
		return { 
			...state,
			categorySource: { ...state.categorySource, list: action.payload.courses, loading: false },
			total: action.payload.count,
		}
	},
	['video/get/failed/categorySource'](state, action) {
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: false, },
		};
	},
	// -------------------------------------------------------
	['video/get/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: true, },
		};
	},
	['video/get/success/recommend'](state, action) {
		return { 
			...state,
			recommend: { ...state.recommend, list: action.payload, loading: false },
		}
	},
	['video/get/failed/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: false, },
		};
	},
	// -----------课程详细列表--------------------------------------------
	// ['video/init/detail'](state, action) {
	// 	data['fuc'] = action.fuc
	// 	data['coursesId'] = action.id
	// 	return { 
	// 	...state, 
	// 	isSelectContext: { ...state.isSelectContext, id: action.id, loading: true, },
	// 	};
	// },
	['video/get/detail'](state, action) {
		// 触发此action需要 id
		return { 
		...state, 
		isSelectContext: { ...state.isSelectContext, loading: true, },
		};
	},
	['video/get/success/detail'](state, action) {
		// 触发此action需要 id
		return { 
			...state,
			isSelectContext: { ...state.isSelectContext, context: action.payload, loading: false },
		}
	},
	['video/get/series'](state, action) {
		// 触发此action需要 id pagination
		return { 
		...state, 
		isSelectContext: { ...state.isSelectContext, loading: true, },
		};
	},
	['video/get/success/series'](state, action) {
		return { 
			...state,
			isSelectContext: { 
				...state.isSelectContext, 
				list: action.payload.video_list, 
				loading: false,
				total: action.payload.count
			},
		}
	},
	['video/get/comment'](state, action) {//获取有关联的列表
		// 触发此action需要 id pagination

		return { 
		...state, 
		isSelectContext: { ...state.isSelectContext, loading: true, },
		};
	},
	['video/get/success/comment'](state, action) {
		return { 
			...state,
			isSelectContext: { 
				...state.isSelectContext, 
				comment: action.payload.posts, 
				loading: false,
				total: action.payload.count
			},
		}
	},
	['video/post/comment'](state, action) {
		// // 触发此action需要 body ,id
		// data['body'] = { body: action['body'], author_id: action['author_id'], course_id: action['id']}
		return { ...state,}
	},
	['video/delete/comment'](state, action) {
		// 触发此action需要 id comment_id
		return { ...state,}
	},
	/**['video/changeMode'](state, action) {
		/**模式有主页展示，推荐模式，分类展示
		const newMode = action.mode;
		return { ...state, mode: newMode }
	},**/
	// --------------play video--------------------
	['video/init/video'](state, action) {
		const { isSelectContext } = state
		return { 
			...state, 
			isSelectContext: { 
				...isSelectContext,
				id: action.courseId,
			},
		};
	},
	['video/changeVideo'](state, action) {
		const { isSelectContext } = state
		return { 
			...state, 
			isSelectContext: { 
				...isSelectContext,
				isSelectContext: {
					...isSelectContext.isSelectContext,
					isSelectVideo: action.isSelectVideo
				}
			},
		};
	},
	// ------------通用--改变分页-----------------------------------------
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
			 '兴趣生活',
			 ],
	isSelectCategory: 0,//选定的分类，没选定就是分类的7
	isSelectPagination: 1,//选定的分页，默认从1开始
	isSelectContext: {
		total: 0,
		id: 0,
		context: {},
		list: [],
		comment: [],//课程评论列表
		isSelectContext:{
			isSelectVideo: 0,// list 列表中的顺序

		}//选定内容中的内容
	},//选定的内容
	upload: {
		uploadState: 0, // 上传百分比
	},
	loading: false,//加载中
});

export default video;