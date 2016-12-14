import { handleActions } from 'redux-actions';
import { combineReducer, subscriptions } from 'redux';

const backstage = handleActions({
	['backstage/init'](state, action){
		return { ...state, list: [], isSelectMenuItem: action.isSelectMenuItem}
	},
	['backstage/get/List'](state, action){
		// context: user, course, text, test, post
		return { ...state, loading: true}
	},
	['backstage/get/List/success'](state, action){
		// context: user, course, text, test, post
		return { ...state, loading: false, list: action.payload, count: action.count}
	},
	['backstage/get/List/failed'](state, action){
		// context: user, course, text, test, post
		return { ...state, loading: false,}
	},
	['backstage/search/List'](state, action){
		// context: user, course, text, test, post
		return { ...state, loading: true}
	},
	['backstage/search/List/success'](state, action){
		// context: user, course, text, test, post
		return { ...state, loading: false, list: action.payload, count: action.count}
	},
	['backstage/search/List/failed'](state, action){
		// context: user, course, text, test, post
		return { ...state, loading: false,}
	},
	['backstage/control/List'](state, action){
		// context: user, course, text, test, post
		// body: 
		return { ...state,}
	},
	['backstage/changeSelectContext'](state, action){
		return { ...state, isSelectContext: action.isSelectContext}
	},
	['backstage/changeCategory'](state, action){
		return { ...state, isSelectCategory: action.isSelectCategory}
	},
	['backstage/changeMenuItem'](state, action){
		return { ...state, isSelectMenuItem: action.isSelectMenuItem}
	},
	['backstage/changePagination'](state, action){
		return { ...state, isSelectPagination: action.isSelectPagination}
	},
	['backstage/toggleModal'](state, action) {
		return { ...state, modalState: action.modalState};
	},
},{
	list: [],// 返回结果的主内容列表
	subList: [],// 返回结果的副内容的列表
	modalState: false,//modal是否被激活
	count: 0, // 总数
	keyWord: '',// 搜索关键子
	loading: false, // 是否正在阅读
	isSelectCategory: '1',//选定的分类
	isSelectMenuItem: '1',// 选定的菜单
	isSelectPagination: 1,//选定的分页，默认从1开始
	isSelectContext: {}, // 选定的内容
})
export default backstage