import { handleActions } from 'redux-actions';
import { combineReducer, subscriptions } from 'redux';

import { data } from '../services/test.js';//向test传送的数据

const test = handleActions({
	['test/init/categorySource'](state, action){
		return{ ...state, loading: true }
	},
	['test/init/commplete/categorySource'](state, action){
		return{ ...state, isSelectCategory: action.category, isSelectPagination: action.pagination, loading: false}
	},
	['test/get/categorySource'](state, action) {
		data['category'] = state.isSelectCategory - 1;
		data['pagination'] = state.isSelectPagination;
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: true, },
		};
	},
	['test/get/success/categorySource'](state, action) {
		return { 
			...state,
			categorySource: { ...state.categorySource, list: action.payload.test_list, loading: false },
			total: action.payload.count,
		}
	},
	['test/get/failed/categorySource'](state, action) {
		return { 
		...state, 
		categorySource: { ...state.categorySource, loading: false, },
		};
	},

	['test/get/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: true, },
		};
	},
	['test/get/success/recommend'](state, action) {
		return { 
			...state,
			recommend: { ...state.recommend, list: action.payload, loading: false },
		}
	},
	['test/get/failed/recommend'](state, action) {
		return { 
		...state, 
		recommend: { ...state.recommend, loading: false, },
		};
	},
	// -----------详细列表--------------------------------------------
	['test/init/detail'](state, action) {
		// data['fuc'] = action.fuc
		data['testId'] = action.id
		return { 
		...state, 
		isSelectContext: { ...state.isSelectContext, id: action.id, loading: true, },
		isSelectPagination: 1,
		};
	},
	['test/get/detail'](state, action) {//获取有关联的列表

		return { ...state, };
	},
	['test/get/success/detail'](state, action) {
		return { 
			...state,
			isSelectContext: { 
				...state.isSelectContext, 
				context: action.payload, 
				loading: false 
			},
		}
	},
	['test/get/series'](state, action) {//获取有关联的列表
		// count: part, all
		return { ...state, };
	},
	['test/get/success/series'](state, action) {
		let count = 0;
		action.payload.map(data=>{
			if(data.problem_type == 0) count++;
		})
		return { 
			...state,
			isSelectContext: { 
				...state.isSelectContext, 
				list: action.payload, 
				total: count,
				// next: action.payload.next
			},
		}
	},
	// ['test/get/comment'](state, action) {//获取有关联的列表
	// 	return { 
	// 	...state, 
	// 	isSelectContext: { ...state.isSelectContext, loading: true, },
	// 	};
	// },
	// ['test/get/success/comment'](state, action) {
	// 	return { 
	// 		...state,
	// 		isSelectContext: { ...state.isSelectContext, comment: action.payload.posts, loading: false },
	// 	}
	// },
	// ['test/post/comment'](state, action) {
	// 	data['body'] = { body: action['body'], author_id: action['author_id'], course_id: action['id']}
	// 	return { ...state,}
	// },
	// ['test/delete/comment'](state, action) {
		
	// 	return { ...state,}
	// },
	/**['test/changeMode'](state, action) {
		/**模式有主页展示，推荐模式，分类展示
		const newMode = action.mode;
		return { ...state, mode: newMode }
	},**/
	// ------------------end------------------------------
	// ------------------test play------------------------
	// ['test/init/play'](state, action) {
	// 	data['testId'] = action.id
	// 	return { 
	// 	...state, 
	// 	isSelectContext: { ...state.isSelectContext, id: action.id },
	// 	};
	// },
	['test/init/problem'](state, action) {
		console.log(action)
		const { isSelectContext } = state
		const { isSubmit } = isSelectContext.isSelectContext
		let issubmit = false;
		if(action.isSubmit != undefined) issubmit = action.isSubmit;
		else issubmit = isSubmit
		return { 
			...state, 
			isSelectContext: { 
				...isSelectContext,
				id: action.testId,
				isSelectContext: {
					...isSelectContext.isSelectContext,
					testRecordId: action.testRecordId,
					isSubmit: issubmit,
					result: [],
				}
			},
		};
	},
	['test/set/problemisSubmit'](state, action) {
		console.log(action)
		const { isSelectContext } = state
		return { 
			...state, 
			isSelectContext: { 
				...isSelectContext,
				isSelectContext: {
					...isSelectContext.isSelectContext,
					isSubmit: action.isSubmit,
				}
			},
		};
	},
	['test/post/problemResult'](state, action) {
		const { isSelectContext } = state
		return { 
			...state, 
			isSelectContext: { 
				...isSelectContext,
				isSelectContext: {
					...isSelectContext.isSelectContext,
					isSubmit: true,
				}
			},
		};
	},
	['test/post/success/problemResult'](state, action) {
		const { isSelectContext } = state
		const { result } = isSelectContext.isSelectContext
		return { 
			...state, 
			isSelectContext: { 
				...isSelectContext,
				isSelectContext: {
					...isSelectContext.isSelectContext,
					result: [...result, action.payload ]
				}
			},
		};
	},
	['test/get/problemResult'](state, action) {
		return { ...state }
	},
	['test/get/success/problemResult'](state, action) {
		const { isSelectContext } = state
		const { submitCount } = isSelectContext.isSelectContext
		return { 
			...state, 
			isSelectContext: { 
				...isSelectContext,
				isSelectContext: {
					...isSelectContext.isSelectContext,
					accuracy: action.accuracy,
					// isSubmit: false,
				}
			},
		};
	},
	['test/countProblem'](state, action) {
		const { isSelectContext } = state
		const { isComplete } = isSelectContext.isSelectContext
		return { 
			...state, 
			isSelectContext: { 
				...isSelectContext,
				isSelectContext: {
					...isSelectContext.isSelectContext,
					// problemId: action.problemId,
					isComplete: action.isComplete,
					// id: isSelectContext.list[action.problemId].id,
					// status: false,
				}
			},
		};
	},
	['test/changeRoll'](state, action) {
		const { isSelectContext } = state
		return { 
			...state, 
			isSelectContext: { 
				...isSelectContext,
				isSelectContext: {
					...isSelectContext.isSelectContext,
					isRolling: action.isRolling
				}
			},
		};
	},
	// ------------------end------------------------------
	['test/changeCategory'](state, action) {
		return { ...state, isSelectCategory: action.isSelectCategory }
	},
	['test/changePagination'](state, action) {
		return { ...state, isSelectPagination: action.isSelectPagination }
	},
	// ['test/changeTime'](state, action) {
	// 	return { ...state, time: Date.now() }
	// },
}, {
	stateName: 'test',
		categorySource: {//分页中的列表
			list:[],
			loading: false,
		},
		recommend: {//主页，推荐栏列表
			list:[],
			loading: false,
		},//看api分类
	total: 0,//数据总数
	categoryTitle: '试题分类',
	category: [
			'全部试题',
			 '互联网/计算机',
			 '基础科学',
			 '工程技术',
			 '历史哲学',
			 '经管法律',
			 '语言文学',
			 '艺术音乐',
			 '兴趣生活',
			 ],
	isSelectCategory: 0,//选定的分类，没选定就是分类的1
	isSelectPagination: 1,//选定的分页，默认从1开始
	isSelectContext: {//选定的内容
		total: 0,//列表总数
		id: 0,// 选择的测试
		context: {},
		list: [],
		comment: [],//课程评论列表
		isSelectContext: {
			id: null,//指问题本身的id
			testRecordId: 0,// 测试记录id，可以从用户中心获取或者测试中心
			accuracy: null,// 正确率
			result: [], // 试题结果，对错按顺序存
			// modalStatus: ,// modal状态
			// problemId: 0,//正在做的第几题(指的是isSelectContext的list顺序中的id)
			// answer: '',// 用户的回答
			isSubmit: false,// 是否提交题目
			isRolling: false,// 是否滚动
			isComplete: 0, // 完成题目数量
			// status: false,// 是否完成该题目（指已经接受到该题目的数据）
		},//选定内容再选择里面的列表
	},//选定的内容
	loading: false,//加载中
	time: Date.now(),// 时间戳保持表单唯一
});

export default test;