import { handleActions } from 'redux-actions';
import { combineReducer } from 'redux';

const menu = handleActions({
	['menu/get'](state, action) {
	  return { ...state };
	},
	['menu/isSelect'](state, action) {
		const id = action.payload;
		const newList = state.list.map(line =>{
			if(id === line.id){
				return { ...line, isSelect: true }
			}
			else{
				return { ...line, isSelect: false }
			}
		});
		console.log(action)
		return { ...state, list: newList, selectkey: id };
	},
}, {
	list: [{
		id: 1,
		title: '互联网/计算机',
		sum: 99,
		
	},{
		id: 2,
		title: '基础科学',
		sum: 99,
		
	},{
		id: 3,
		title: '工程技术',
		sum: 99,
		
	},
	{
		id: 4,
		title: '历史哲学',
		sum: 99,
		
	},
	{
		id: 5,
		title: '经管法律',
		sum: 99,
		
	},
	{
		id: 6,
		title: '语言文学',
		sum: 99,
		
	},
	{
		id: 7,
		title: '艺术音乐',
		sum: 99,
		
	},],
	selectkey: 0,
});

export default menu;