import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const upload = handleActions({
	
	['upload/drop'](state, action) {
		return { ...state, files: action.files };
	},
	['upload/multiplyPlus'](state, action) {
		// let newList = state.uploadListFiles.concat(action.uploadListFiles)
		return { ...state, uploadListFiles: action.uploadListFiles };
	},
	['upload/multiplyPlusUploadList'](state, action) {
		return { ...state, uploadList: action.uploadList };
	},
	['upload/tmpPlus'](state, action) {
		return { ...state, tmpFile: action.tmpFile };
	},
	['upload/itemDataPlus'](state, action) {
		return { ...state, itemData: action.itemData, itemIndex: action.itemIndex };
	},
	['upload/uploadFileOrder'](state, action) {
		return { ...state, order: action.order };
	},
	['upload/multiplyDeleteUploadList'](state, action) {
		const newList = state.uploadListFiles.filter(list => list != action.Data)
		return { ...state, uploadList: newList };
	},
	// ------------saga---------------------
	// redux-saga返回的数据 在user中处理
	['upload/get/token'](state, action) {
	  return { ...state };
	},
	['upload/get/success/token'](state, action) {
		return { ...state, token: action.payload };
	},

	['upload/get/userVideo'](state, action) {
	  return { ...state, loading: true, isSelectContext: {} };
	},
	['upload/get/userText'](state, action) {
	  return { ...state, loading: true, isSelectContext: {} };
	},
	['upload/get/userTest'](state, action) {
	  return { ...state, loading: true, isSelectContext: {} };
	},
	['upload/get/success/isSelectContext'](state, action) {
		return { ...state, isSelectContext: action.payload, loading: false };
	},

	['upload/get/userVideoList'](state, action) {
		return { ...state, loading: true, isSelectContextList: [] };
	},
	// ['upload/get/userTextList'](state, action) {
	//   return { ...state, loading: true, isSelectContextList: [] };
	// },
	['upload/get/userTestList'](state, action) {
	  	return { ...state, loading: true, isSelectContextList: [] };
	},
	['upload/get/success/isSelectContextList'](state, action) {
		let list = action.payload.map((data,index)=>{
			if(!data.show) return;
		})
		return { ...state, isSelectContextList: action.payload, loading: false };
	},
	// post
	['upload/post/createCourse'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/post/createVideo'](state, action) {// 二级数据
		return { ...state, };
	},
	['upload/post/createText'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/post/createTest'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/post/createProblem'](state, action) {// 二级数据
		return { ...state, };
	},
	['upload/post/createPost'](state, action) {// 一级数据
		return { ...state, };
	},
	// put
	['upload/put/createCourse'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/put/createVideo'](state, action) {// 二级数据
		return { ...state, };
	},
	['upload/put/createText'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/put/createTest'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/put/createProblem'](state, action) {// 二级数据
		return { ...state, };
	},
	['upload/put/createPost'](state, action) {// 一级数据
		return { ...state, };
	},
	// del
	['upload/del/createCourse'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/del/createVideo'](state, action) {// 二级数据
		return { ...state, };
	},
	['upload/del/createText'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/del/createTest'](state, action) {// 一级数据
		return { ...state, };
	},
	['upload/del/createProblem'](state, action) {// 二级数据
		return { ...state, };
	},
	['upload/del/createPost'](state, action) {// 一级数据
		return { ...state, };
	},

	// --------------状态-------------------
	['upload/init'](state, action) {
		return { ...state, tmpFile:[], uploadListFiles: [], isEdit: false,};
	},
	['upload/setProgress'](state, action) {
		return { ...state, progress: action.progress };
	},
	['upload/setMultiplyProgress'](state, action) {
		return { ...state, uploadListProgress: action.uploadListProgress };
	},
	['upload/changeMenuItem'](state, action) {
		return { ...state, isSelectMenuItem: action.item };
	},
	['upload/changeEditState'](state, action) {// 顺便带上选择内容的id
		return { ...state, isEdit: action.isEdit, isSelectContextId: action.isSelectContextId };
	},
	['upload/changeModalState'](state, action) {
		if(action.model == 'item') return { ...state, itemModalState: action.itemModalState };
		return { ...state, modalState: action.modalState };
	},
	['upload/changeTime'](state, action) {
		return { ...state, time: Date.now() };
	},
	['upload/changeSubmitState'](state, action) {
		return { ...state, isSubmit: action.isSubmit };
	},
}, {
	// 单文件【
	files: [], //0位置为一级数据，1位为二级数据单文件【用于修改视频文件作用
	progress: 0, //可为array或int
	token: '',
	modalState: false,//modal是否被激活
	itemModalState: false,//item的modal是否被激活
	loading: false,
	
	// 多文件模式
	tmpFile:[],//创建时临时存放的文件，事后再添加到列表（测试图片不需要）
	uploadList: [],// 上传列表的一个包含除了文件还有其他参数
	uploadListFiles: [],// 文件列表(一个测试一个列表,一个测试添加到列表后清除这个)
	uploadListProgress: [],//可为array或int
	time: Date.now(),// 用时间确定唯一的表单【在uploadqueue中使用，
	// upload/post/createVideo或problem被触发都更新时间以保证表单被更新
	itemData: {},//uploaditem 传上来的数据
	itemIndex: 0,
	// order:{ isOrder: false },//uploadList 中文件排序
	order: [],

	isSelectMenuItem: '1',
	isEdit: false, // ture为进入编辑页面
	isSubmit: false,// 是否真正提交表单
	isSelectContextId: 0,// 选择的内容【课程／资料／测试】的id
	isSelectContext: {},// 选择的内容[课程／资料／测试]
	isSelectContextList: [],// 视频，问题
});

export default upload;