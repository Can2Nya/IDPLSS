import xFetch from './xFetch';

let apiUrl = 'http://api.jxnugo.com'
// let apiUrl = '127.0.0.1:5000'
export let data = {}

export async function getVideoCategory(action) {
	let url;
	if (data['category']!== -1 ) url = apiUrl+'/api/courses/category/'+data['category']+'?page='+data['pagination']
	else url = apiUrl+'/api/courses?page='+data['pagination']
  	return xFetch(url,{method: 'GET',});
}
export async function getVideoDetail(action) {
	return xFetch(`${apiUrl}/api/courses/detail/${action.id}`,{method: 'GET',});
}

export async function getVideoDetailList(action) {
	let url = `${apiUrl}/api/courses/${action.id}`;
	if(action.type == 'video/get/series') url += '/video-list';
	if(action.type == 'video/get/comment') url += '/comments';
	
	return xFetch(url,{method: 'GET',});
}

export async function postVideoDetailComment(action) {
	return xFetch(`${apiUrl}/api/courses/detail/${action.id}/new-comment`,{method: 'POST',
		body: JSON.stringify(action.body),
	});
}

export async function deleteVideoDetailComment(action) {
	return xFetch(`${apiUrl}/api/courses/detail/comment/${action.comment_id}`,{method: 'DELETE',});
}