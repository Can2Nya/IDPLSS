import xFetch from './xFetch';

let apiUrl = 'http://api.jxnugo.com'
// let apiUrl = '127.0.0.1:5000'
export let data = {}

export async function getTextCategory(action) {
	if (data['category']!= -1 ) {
		if (data['type']!= -1 || data['type']!= '-1') return xFetch(apiUrl+'/api/text-resources/category/'+data['category']+'/type/'+data['type']+'?page='+data['pagination'],{method: 'GET',})
		else return xFetch(apiUrl+'/api/text-resources/category/'+data['category']+'?page='+data['pagination'],{method: 'GET',})
	}
	else{
		// if (data['type']!= -1 ) return xFetch(apiUrl+'/api/text-resources/type/'+data['type']+'?page='+data['pagination'],{method: 'GET',})
		return xFetch(apiUrl+'/api/text-resources?page='+data['pagination'],{method: 'GET',});
	}
}

export async function getTextRecommend(action) {
	return xFetch(`${apiUrl}/api/recommend/popular-text-resources`,{method: 'GET',});
}

export async function getTextDetail(action) {
	return xFetch(`${apiUrl}/api/text-resources/${action.id}`,{method: 'GET',});
}

export async function getTextDetailList(action) {
	let url = `${apiUrl}/api/text-resources/${action.id}`;
	// if(action.type == 'video/get/series') url += '/video-list';
	if(action.type == 'text/get/comment') url += '/comments';
	
	return xFetch(url,{method: 'GET',});
}

export async function postTextDetailComment(action) {
	return xFetch(`${apiUrl}/api/text-resources/${action.id}/new-comment`,{method: 'POST',
		body: JSON.stringify(action.body),
	});
}

export async function deleteTextDetailComment(action) {
	return xFetch(`${apiUrl}/api/text-resources/comment/${action.comment_id}`,{method: 'DELETE',});
}