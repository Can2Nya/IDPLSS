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
export async function getVideoRecommend(action) {
	return xFetch(`${apiUrl}/api/recommend/popular-courses`,{method: 'GET',});
}
export async function getVideoDetail(action) {
	if(action.mode == 'course'){
		return xFetch(`${apiUrl}/api/courses/detail/${action.id}`,{method: 'GET',});
	}
	if(action.mode == 'video'){
		return xFetch(`${apiUrl}/api/courses/${action.courseId}/video/${action.id}`,{method: 'GET',});
	}
}

export async function getVideoDetailList(action) {
	let url = `${apiUrl}/api/`;
	if(action.type == 'video/get/series'){
		if(action.count == 'part') url += `courses/${action.id}/video-list`;
		if(action.count == 'all') url += `user/self-course/${action.id}/video`
	} 
	if(action.type == 'video/get/comment') url += `courses/${action.id}/comments`;
	
	return xFetch(url,{method: 'GET',});
}

export async function postVideoDetailComment(action) {
	return xFetch(`${apiUrl}/api/courses/${action.id}/new-comment`,{method: 'POST',
		body: JSON.stringify(action.body),
	});
}

export async function deleteVideoDetailComment(action) {
	return xFetch(`${apiUrl}/api/courses/comment/${action.comment_id}`,{method: 'DELETE',});
}