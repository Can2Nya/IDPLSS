import xFetch from './xFetch';

let apiUrl = 'http://api.jxnugo.com'
export let data = {}

export async function getTextCategory() {
	if (data['category']!= -1 ) {
		if (data['type']!= -1 || data['type']!= '-1') return xFetch(apiUrl+'/api/text-resources/category/'+data['category']+'/type/'+data['type']+'?page='+data['pagination'],{method: 'GET',})
		else return xFetch(apiUrl+'/api/text-resources/category/'+data['category']+'?page='+data['pagination'],{method: 'GET',})
	}
	else{
		// if (data['type']!= -1 ) return xFetch(apiUrl+'/api/text-resources/type/'+data['type']+'?page='+data['pagination'],{method: 'GET',})
		return xFetch(apiUrl+'/api/text-resources?page='+data['pagination'],{method: 'GET',});
	}
  	
}
export async function getTextDetail() {
	return xFetch(apiUrl+'/api/text-resources/'+data['coursesId'],{method: 'GET',});
}

export async function getTextDetailList() {
	let url = '/api/text-resources/'+data['coursesId'];
	//if(data['fuc'] == 'series') url += '/video-list';
	if(data['fuc'] == 'comment') url += '/comments';
	
	return xFetch(url,{method: 'GET',});
}

export async function postTextDetailComment() {
	return xFetch(apiUrl+'/api/text-resources/detail/'+data['coursesId']+'/new-comment',{method: 'POST',
		body: JSON.stringify(data['body']),
	});
}

export async function deleteTextDetailComment() {
	return xFetch(apiUrl+'/api/text-resources/detail/comment/'+data['commentId'],{method: 'DELETE',});
}