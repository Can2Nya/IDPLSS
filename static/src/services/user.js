import xFetch from './xFetch';

var apiUrl = 'http://api.jxnugo.com'
// let apiUrl = '127.0.0.1:5000'
// export var data = {}

export async function userLogin(action) {
	return xFetch(`${apiUrl}/api/user/verify`,{method: 'POST',
		body: JSON.stringify(action.body),
	});
}

export async function getUserState(action) {// action为saga call() 传的参数
  	return xFetch(`${apiUrl}/api/user/${action.user_id}/info`,{method: 'GET',});
}

export async function setUserState(action) {
	return xFetch(`${apiUrl}/api/user/info`,{method: 'PUT',
		body:JSON.stringify({
			name: 'nya',
			avatar: "jfkasjdfjasjdfa",
    		about_me: "hello,this is me",
		}),
	});
}

export async function userRegister(action) {

  	return xFetch(`${apiUrl}/api/user/register`,{method: 'POST',
  		body:JSON.stringify(action.body),
  });
}

export async function userRegisterConfirm(action) {
	return xFetch(`${apiUrl}/api/user/confirm/${action.confirm_code}`,{method: 'GET',});
}

export async function UserisFollowing(action) {
	return xFetch(`${apiUrl}/api/user/is_following`,{method: 'POST',
		body:JSON.stringify({
			search_user_id: 2,
		}),
	});
}

export async function UserisFollowedBy() {
	return xFetch(`${apiUrl}/api/user/is_followed_by`,{method: 'POST',
		body:JSON.stringify({
			search_user_id: 2
		}),
	});
}