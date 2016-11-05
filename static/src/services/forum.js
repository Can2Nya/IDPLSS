import xFetch from './xFetch';

let apiUrl = 'http://api.jxnugo.com'
// let apiUrl = '127.0.0.1:5000'
export let data = {}

export async function getForumCategory(action) {
	if (data['category']!== -1 ) return xFetch(apiUrl+'/api/posts/category/'+data['category']+'?page='+data['pagination'],{method: 'GET',})
  	return xFetch(`${apiUrl}/api/posts?page=${data['pagination']}`,{method: 'GET',});
}

export async function getForumDetail(action) {
	let url = `${apiUrl}/api/posts/` + action.id
	return xFetch(url,{method: 'GET',});
}

export async function getForumDetailList(action) {//获取所有评论
	let url = `${apiUrl}/api/posts/${action.id}/comments?page=${action.pagination}`;
	return xFetch(url,{method: 'GET',});
}

// export async function postForumDetail(action) {//发布帖子
// 	return xFetch(`${apiUrl}/api/posts/new-post`,{method: 'POST',
// 		body: JSON.stringify(action.body),
// 	});
// }

export async function postForumDetailComment(action) {//对帖子评论
	return xFetch(`${apiUrl}/api/posts/${action.id}/new-comment`,{method: 'POST',
		body: JSON.stringify(action.body),
	});
}

export async function deleteForumDetailComment(action) {
	return xFetch(`${apiUrl}/api/posts/comment/${action.comment_id}`,{method: 'DELETE',});
}