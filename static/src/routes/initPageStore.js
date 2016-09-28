//初始化page的store
//咱知道这个没什么luan用，果然咱还没学好export
function initPageStore (history,dispatch){
	history.listen(({ pathname, hash }) =>{
		//分类页初始化
		if(pathname.search('category')!== -1){
			const matchpathname = pathToRegexp('/category/:context/').exec(pathname)
			const context = matchpathname[1];
			if(hash){
				const match = pathToRegexp('#!/:category/:pagination').exec(hash);
				const category = parseInt(match[1]);
				const pagination = parseInt(match[2]);
				dispatch({
					type: `${context}/init`,
					category: category,
					pagination: pagination,
				})
			}
			else{
				dispatch({
					type: `${context}/init`,
					category: 7,
					pagination: 1,
				})
			}
			dispatch({
				type: `${context}/get/categorySource`
			})
		}
		//end
		//....
	})
}

export default initPageStore;