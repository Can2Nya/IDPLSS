import xFetch from './xFetch';

let apiUrl = 'http://api.jxnugo.com'
export let data = {}

export async function getVideoList() {
	if (data['category']!==7) return xFetch(apiUrl+'/api/courses-video/category/'+data['category']+'?page='+data['pagination'],{method: 'GET',})
  	return xFetch(apiUrl+'/api/courses-video?page='+data['pagination'],{method: 'GET',});
}