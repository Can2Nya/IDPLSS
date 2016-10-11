import xFetch from './xFetch';

let apiUrl = 'http://api.jxnugo.com'
// let apiUrl = '127.0.0.1:5000'
export let data = {}

export async function getVideoCategory() {
	let url;
	if (data['category']!== -1 ) url = apiUrl+'/api/courses/category/'+data['category']+'?page='+data['pagination']
	else url = apiUrl+'/api/courses?page='+data['pagination']
  	return xFetch(url,{method: 'GET',});
}
export async function getVideoDetail() {
	return xFetch(apiUrl+'/api/courses/detail/'+data['coursesId'],{method: 'GET',});
}

export async function getVideoDetailList() {
	let url = '/api/courses/'+data['coursesId'];
	if(data['fuc'] == 'series') url += '/video-list';
	if(data['fuc'] == 'comment') url += '/comments';
	
	return xFetch(url,{method: 'GET',});
}

export async function postVideoDetailComment() {
	return xFetch(apiUrl+'/api/courses/detail/'+data['coursesId']+'/new-comment',{method: 'POST',
		body: JSON.stringify(data['body']),
	});
}

export async function deleteVideoDetailComment() {
	return xFetch(apiUrl+'/api/courses/detail/comment/'+data['commentId'],{method: 'DELETE',});
}