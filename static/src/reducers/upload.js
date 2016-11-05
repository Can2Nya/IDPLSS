import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const upload = handleActions({
	
	['upload/drop'](state, action) {
		return { ...state, files: action.files };
		// return { ...state, files: [action.file, ...state.files ] };
	},
	['upload/multiplyPlus'](state, action) {
		let newList = state.uploadListFiles.concat(action.uploadListFiles)
		return { ...state, uploadListFiles: newList };
		// return { ...state, files: [action.file, ...state.files ] };
	},
	['upload/multiplyPlusUploadList'](state, action) {
		return { ...state, uploadList: [ ...state.uploadList, action.uploadList] };
		// return { ...state, files: [action.file, ...state.files ] };
	},
	['upload/tmpPlus'](state, action) {
		return { ...state, tmpFile: action.tmpFile };
		// return { ...state, files: [action.file, ...state.files ] };
	},
	['upload/multiplyDelete'](state, action) {
		const newList = state.uploadListFiles.filter(file => file.lastModified != action.lastModified)
		return { ...state, uploadListFiles: newList };
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
		return { ...state, isSelectContextList: action.payload, loading: false };
	},

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

	// --------------状态-------------------
	['upload/init'](state, action) {
		return { ...state, files: [] };
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
		return { ...state, modalState: action.modalState };
	},
	['upload/changeTime'](state, action) {
		return { ...state, time: Date.now() };
	},
}, {
	// 单文件【瞎jb起错名（复数是什么鬼！
	files: [], //0位置为一级数据，1位为二级数据单文件？？？？【用于修改视频文件作用
	progress: 0, //可为array或int
	token: '',
	modalState: false,//modal是否被激活
	loading: false,
	
	// 多文件模式
	tmpFile:[],//不知道怎么解释了。。。创建时临时存放的文件，事后再添加到列表
	uploadList: [],// 上传列表的一个包含除了文件还有其他参数
	uploadListFiles: [],// 文件列表
	uploadListProgress: [],//可为array或int
	time: Date.now(),// 用时间确定唯一的表单【在uploadqueue中使用，
	// upload/post/createVideo或problem被触发都更新时间以保证表单被更新

	isSelectMenuItem: '1',
	isEdit: false, // ture为进入编辑页面
	isSelectContextId: 0,// 选择的内容【课程／资料／测试】的id
	isSelectContext: {},// 选择的内容[课程／资料／测试]
	isSelectContextList: [],// 视频，问题
});

export default upload;