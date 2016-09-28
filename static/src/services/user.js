import xFetch from './xFetch';

var apiUrl = 'http://api.jxnugo.com'
export var data = {}

export async function getUserState() {
  	return xFetch(apiUrl+'/api/user/info',{method: 'GET',});
}

export async function setUserState() {
	return xFetch(apiUrl+'/api/user/info',{method: 'PUT',
		body:JSON.stringify({
			name: 'nya',
			avatar: "jfkasjdfjasjdfa",
    		about_me: "hello,this is me",
		}),
	});
}

export async function userRegister() {
  	return xFetch(apiUrl+'/api/user/register',{method: 'POST',
  		body:JSON.stringify(data['body']),
  });
}

export async function UserisFollowing() {
	return xFetch(apiUrl+'/api/user/is_following',{method: 'POST',
		body:JSON.stringify({
			search_user_id: 2,
		}),
	});
}

export async function UserisFollowedBy() {
	return xFetch(apiUrl+'/api/user/is_followed_by',{method: 'POST',
		body:JSON.stringify({
			search_user_id: 2
		}),
	});
}

/*通用方法*/
/*export async function getjson() {
	console.log(option)
	return xFetch(apiUrl+option['patchName'],option['data']);
}*/