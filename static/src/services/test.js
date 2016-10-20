import xFetch from './xFetch';

let apiUrl = 'http://api.jxnugo.com'
// let apiUrl = '127.0.0.1:5000'
export let data = {}

export async function getTestCategory(action) {
	let url;
	if (data['category']!== -1 ) url = apiUrl+'/api/test-list/category/'+data['category']+'?page='+data['pagination']
	else url = apiUrl+'/api/test-list?page='+data['pagination']
  	return xFetch(url,{method: 'GET',});
}
export async function getTestDetail(action) {
	return xFetch(`${apiUrl}/api/test-list/detail/${action.id}`,{method: 'GET',});
}

export async function getTestDetailList(action) {
	let url = `${apiUrl}/api/test-list/${action.id}`;
	if(action.type == 'test/get/series') url += '/problems';
	// if(action.type == 'video/get/comment') url += '/comments';
	
	return xFetch(url,{method: 'GET',});
}

// export async function postTestDetailComment(action) {
// 	return xFetch(apiUrl+'/api/courses/detail/'+data['coursesId']+'/new-comment',{method: 'POST',
// 		body: JSON.stringify(data['body']),
// 	});
// }

// export async function deleteTestDetailComment(action) {
// 	return xFetch(apiUrl+'/api/courses/detail/comment/'+data['commentId'],{method: 'DELETE',});
// }
export async function postProblemResult(action) {
	return xFetch(apiUrl+'/api/test-list/test-answer/'+data['problemId'],{method: 'POST',
		body: JSON.stringify(data['body']),
	});
}