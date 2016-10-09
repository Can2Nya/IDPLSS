import xFetch from './xFetch';

let apiUrl = 'http://api.jxnugo.com'
export let data = {}

export async function getForumCategory() {
	if (data['category']!== -1 ) return xFetch(apiUrl+'/api/posts/category/'+data['category']+'?page='+data['pagination'],{method: 'GET',})
  	return xFetch(apiUrl+'/api/posts?page='+data['pagination'],{method: 'GET',});
}

export async function getForumDetail() {
	return xFetch(apiUrl+'/api/posts/'+data['coursesId'],{method: 'GET',});
}

export async function getForumDetailList() {//获取所有评论
	let url = '/api/posts/'+data['coursesId']+'/comments';
	// if(data['fuc'] == 'series') url += '/video-list';
	// if(data['fuc'] == 'comment') url += '/comments';
	
	return xFetch(url,{method: 'GET',});
}

export async function postForumDetailComment() {//对帖子评论
	return xFetch(apiUrl+'/api/posts/'+data['post_id']+'/new-comment',{method: 'POST',
		body: JSON.stringify(data['body']),
	});
}

export async function deleteForumDetailComment() {
	return xFetch(apiUrl+'/api/posts/comment/'+data['commentId'],{method: 'DELETE',});
}