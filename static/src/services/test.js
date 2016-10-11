import xFetch from './xFetch';

// let apiUrl = 'http://api.jxnugo.com'
let apiUrl = '127.0.0.1:5000'
export let data = {}

export async function getTestCategory() {
	let url;
	if (data['category']!== -1 ) url = apiUrl+'/api/test-list/category/'+data['category']+'?page='+data['pagination']
	else url = apiUrl+'/api/test-list?page='+data['pagination']
  	return xFetch(url,{method: 'GET',});
}
export async function getTestDetail() {
	return xFetch(apiUrl+'/api/courses/detail/'+data['coursesId'],{method: 'GET',});
}

export async function getTestDetailList() {
	let url = '/api/test-list/'+data['testId']+'/problems';
	// if(data['fuc'] == 'series') url += '/video-list';
	// if(data['fuc'] == 'comment') url += '/comments';
	
	return xFetch(url,{method: 'GET',});
}

// export async function postTestDetailComment() {
// 	return xFetch(apiUrl+'/api/courses/detail/'+data['coursesId']+'/new-comment',{method: 'POST',
// 		body: JSON.stringify(data['body']),
// 	});
// }

// export async function deleteTestDetailComment() {
// 	return xFetch(apiUrl+'/api/courses/detail/comment/'+data['commentId'],{method: 'DELETE',});
// }