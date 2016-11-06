import xFetch from './xFetch';

var apiUrl = 'http://api.jxnugo.com'
// let apiUrl = '127.0.0.1:5000'
// export var data = {}

export async function userLogin(action) {
	return xFetch(`${apiUrl}/api/user/verify`,{method: 'POST',
		body: JSON.stringify(action.body),
	});
}

export async function getUserState(action) {
	// action为saga call() 传的参数
	if(action.type == 'user/get/info' || action.type == 'user/get/loginInfo'){
		return xFetch(`${apiUrl}/api/user/${action.user_id}/info`,{method: 'GET',});
	}else{
		return xFetch(`${apiUrl}/api/user/${action.user_id}/info`,{method: 'PUT',
			body:JSON.stringify(action.body),
		});
	}
  	
}

// export async function setUserState(action) {
// 	return xFetch(`${apiUrl}/api/user/info`,{method: 'PUT',
// 		body:JSON.stringify({
// 			name: 'nya',
// 			avatar: "jfkasjdfjasjdfa",
//     		about_me: "hello,this is me",
// 		}),
// 	});
// }

export async function userRegister(action) {

  	return xFetch(`${apiUrl}/api/user/register`,{method: 'POST',
  		body:JSON.stringify(action.body),
  });
}

export async function userRegisterConfirm(action) {
	return xFetch(`${apiUrl}/api/user/confirm/${action.confirm_code}`,{method: 'GET',});
}

export async function userZoneData(action) {
	let url = `${apiUrl}/api/user/`
	if(action.type == 'user/get/userPost') url+= `posts`;
	if(action.type == 'user/get/userPostComment') url+= `posts-comments`;
	if(action.type == 'user/get/userPostCollection') url+= `collection-posts`;

	if(action.type == 'user/get/userVideo') url+= `courses`;
	if(action.type == 'user/get/userVideoList') url+= `${apiUrl}/api/courses/${action.courseid}/video-list`;
	if(action.type == 'user/get/userVideoComment') url+= `course-comments`;
	if(action.type == 'user/get/userVideoCollection') url+= 'collection-courses';

	if(action.type == 'user/get/userText') url+= `text-resources`;
	if(action.type == 'user/get/userTextComment') url += `text-resource-comments`;
	if(action.type == 'user/get/userTextCollection') url+= `collection-text-resources`;

	if(action.type == 'user/get/userTest') url+= `test-list`;
	if(action.type == 'user/get/userTestList') url = `${apiUrl}/api/test-list/${action.testid}/problems`; 
	if(action.type == 'user/get/userTestComplete') url+= `test-record`;
	url += `?page=${action.pagination}`
	return xFetch(url,{method: 'GET',});
}

export async function UserisFollowing(action) {
	return xFetch(`${apiUrl}/api/user/is_following`,{method: 'POST',
		body:JSON.stringify({
			search_user_id: 2,
		}),
	});
}

export async function UserisFollowedBy(action) {
	return xFetch(`${apiUrl}/api/user/is_followed_by`,{method: 'POST',
		body:JSON.stringify({
			search_user_id: 2
		}),
	});
}
export async function UserUpLoadInfo(action) {
	let url = `${apiUrl}/api/`
	if(action.type == 'upload/get/token') url += 'user/qiniu-token'
	else{
		if(action.type == 'upload/get/userVideo') url+= `courses/detail/${action.id}`;
		if(action.type == 'upload/get/userText') url += `text-resources/${action.id}`; 
		if(action.type == 'upload/get/userTest') url+= `test-list/detail/${action.id}`;
		if(action.type == 'upload/get/userVideoList') url+= `user/self-course/${action.id}/video`;
		if(action.type == 'upload/get/userTestList') url+= `user/${action.id}/self-test-problems`;
		// url += `${action.id}`
	}
	return xFetch(url,{method: 'GET',});
}

export async function UserCreateMainData(action) {
	// 一级数据层【课程，文本，测试
	let url = `${apiUrl}/api/`
	if(action.type.search('createCourse') !== -1) url += 'courses/new-course'
	if(action.type.search('createText') !== -1) url += 'text-resources/new-resource'
	if(action.type.search('createTest') !== -1) url += 'test-list/new-test'
	if(action.type.search('createPost') !== -1)	url += 'posts/new-post'
	return xFetch(url,{method: 'POST' ,body:JSON.stringify(action.body)});
}
export async function UserPutMainData(action) {
	let url = `${apiUrl}/api/`
	if(action.type.search('createCourse') !== -1) url += 'courses/detail/'
	if(action.type.search('createText') !== -1) url += 'text-resources/'
	if(action.type.search('createTest') !== -1) url += 'test-list/detail/'
	url += `${action.id}`
	return xFetch(url,{method: 'PUT' ,body:JSON.stringify(action.body)});
}

export async function UserRecommend(action) {
	let url = `${apiUrl}/api/recommend/`
	if(action.type.search('video') !== -1) url += 'courses/1'
	if(action.type.search('text') !== -1) url += 'text-resources/1'
	if(action.type.search('test') !== -1) url += 'tests/1'
	return xFetch(url,{method: 'GET',});
}
