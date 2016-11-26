import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, Redirect } from 'react-router';
import { connect } from 'react-redux';
import pathToRegexp from 'path-to-regexp';
import cookie from 'js-cookie';

import App from '../components/App';
import Index from '../pages/Index'
import Category from '../pages/Category';
import Detail from '../pages/Detail';
import PostDetail from '../pages/PostDetail';
import Register from '../pages/Register';
import Login from '../pages/Login';
import User from '../pages/User';
import PlayVideo from '../pages/PlayVideo';
// import PlayText from '../pages/PlayText';
import PlayTest from '../pages/PlayTest';
import NotFound from '../pages/NotFound';
import Manage from '../pages/Manage';
import Search from '../pages/Search';

//import { initPageStore } from './initPageStore';

const Routes = ({ history, dispatch }) =>{
	//initPageStore(history,dispatch);
	history.listen(({ pathname, hash }) =>{

		// index init-----------------
		if(pathname.search('index')!== -1){
			if(hash){
				const match = pathToRegexp('#!/:psdtoken').exec(hash)
				dispatch({
					type: 'user/get/passwordToken',
					psdtoken: match[1]
				})
			}
			dispatch({
				type: 'video/get/recommend'
			})
			dispatch({
				type: 'test/get/recommend'
			})
			dispatch({
				type: 'text/get/recommend'
			})
		}
		
		// 注册初始化------------------
		if(pathname.search('register')!== -1){
			const match = pathToRegexp('#!/:token').exec(hash);
			if(match){
				dispatch({
					type: 'user/register/confirm',
					confirm_code: match[1]
				})
			}
		}
		//分类页初始化-------------------
		if(pathname.search('category')!== -1){
			const matchpathname = pathToRegexp('/category/:context/').exec(pathname)
			const context = matchpathname[1];
			dispatch({
				type: `${context}/init/categorySource`
			})
			dispatch({
				type: `user/get/${context}Recommend`
			})
			if(hash){
				const match = pathToRegexp('#!/:category/:pagination').exec(hash);
				const category = parseInt(match[1]);
				const pagination = parseInt(match[2]);
				dispatch({
					type: `${context}/init/commplete/categorySource`,
					category: category,
					pagination: pagination,
				})
			}
			else{
				dispatch({
					type: `${context}/init/commplete/categorySource`,
					category: 0,
					pagination: 1,
				})
			}
			// if(context == 'forum'){
			// 	dispatch({
			// 		type: 'upload/get/token'
			// 	})
			// }
			dispatch({
				type: `${context}/get/categorySource`
			})
		}
		//end------------------------
		// detail init-------------------
		if(pathname.search('detail')!== -1 || pathname.search('post')!== -1){
			let match, context, id, fuc;
			// comment detail
			if(pathname.search('detail')!== -1){
				match = pathToRegexp('/detail/:context/:id/#!/:fuc/:pagination/').exec(pathname+hash);
				context = match[1]
				id = match[2]
				fuc = match[3]
				dispatch({
					type: `${context}/get/detail`,
					mode: 'course',
					id: id
				})
				dispatch({
					type: `${context}/get/${fuc}`,
					id: id,
					pagination: match[4],
					count: 'part',// 写到这里，记得all

				})
				
				dispatch({
					type: 'user/init/collect',
				})
				if(cookie.get('user_id') && cookie.get('authorization')){
					dispatch({
						type: `user/get/${context}Recommend`
					})
					if(context != 'test') {
						dispatch({
							type: 'user/get/collect',
							context: context,
							id: id,
							method: 'GET'
						})
					}
				}
			}
			// post detail
			if(pathname.search('post')!== -1){
				match = pathToRegexp('/post/:id/#!/:pagination/').exec(pathname+hash);
				context = 'forum'
				id = match[1]
				dispatch({
					type: `${context}/get/detail`,
					id: id
				})
				dispatch({
					type: 'forum/get/comment',
					id: id,
					pagination: match[2]
				})
			}
		}
		// -------------end--------------------
		// -test problem init------------------
		if(pathname.search('play/test')!== -1){
			const match = pathToRegexp('/play/test/:testId/:recordId/').exec(pathname);
			dispatch({
				type: 'test/init/problem',
				testId: match[1],
				testRecordId: match[2],

			})
			
			dispatch({
				type: 'test/get/series',
				id: match[1],
				count: 'all',
			})
		}
		// -video init------------------
		if(pathname.search('play/video')!== -1){
			const match = pathToRegexp('/play/video/:courseId/:videoId/').exec(pathname);
			dispatch({
				type: 'video/init/video',
				courseId: match[1],
				videoId: match[2]
			})
			dispatch({
				type: 'video/get/detail',
				mode: 'video',
				courseId: match[1],
				id: match[2]
			})
			dispatch({
				type: 'video/get/detail',
				mode: 'course',
				id: match[1]
			})
			dispatch({
				type: 'video/get/series',
				id: match[1],
				count: 'all',// 写到这里，记得all
			})
		}
		// login listen----------------------
		if(cookie.get('user_id') && cookie.get('authorization')){
			dispatch({
				type: 'user/get/loginInfo',
				user_id: cookie.get('user_id')
			})
			// dispatch({
			// 	type: 'user/get/videoRecommend'
			// })
			// dispatch({
			// 	type: 'user/get/textRecommend'
			// })
			// dispatch({
			// 	type: 'user/get/testRecommend'
			// })
		}
		// user zone init-----------------------
		if(pathname.search('user')!== -1){
			
			const match = pathToRegexp('/user/:id/#!/:fuc/:subTab/').exec(pathname+hash)
			dispatch({
				type: 'user/get/info',
				user_id: match[1]
			})
			let action = 'user/get/user';
			if(match[2] == 'dynamic'){
				//统计数据接口
				dispatch({
					type: 'user/get/stat',
					mode: 'frequency'
				})
				dispatch({
					type: 'user/get/stat',
					mode: 'interestedField'
				})
				
				dispatch({
					type: 'user/changeSelectTab',
					isSelectTab: '0'
				})
			}
			
			if(match[2] == 'post'){
				dispatch({
					type: 'user/changeSelectTab',
					isSelectTab: '1'
				})
				switch(match[3]){
					case '0': action += 'Post'; break;
					case '1': action += 'PostComment'; break;
				}
			}
			if(match[2] == 'favorite'){
				dispatch({
					type: 'user/changeSelectTab',
					isSelectTab: '2'
				})

				switch(match[3]){
					case '0': action += 'VideoCollection'; break;
					case '1': action += 'TextCollection'; break;
					case '2': action += 'TestComplete'; break;
				}
			}
			if(match[2] == 'comment'){
				dispatch({
					type: 'user/changeSelectTab',
					isSelectTab: '3'
				})
				switch(match[3]){
					case '0': action += 'VideoComment'; break;
					case '1': action += 'TextComment'; break;
				}
			}
			if(match[2] == 'upload'){
				dispatch({
					type: 'user/changeSelectTab',
					isSelectTab: '4'
				})
				switch(match[3]){
					case '0': action += 'Video'; break;
					case '1': action += 'Text'; break;
					case '2': action += 'Test'; break;
				}
			}
			if(match[2] == 'setting'){
				dispatch({
					type: 'user/changeSelectTab',
					isSelectTab: '5'
				})
				dispatch({
					type: 'upload/get/token'
				})
			}
			dispatch({
				type: 'user/changeSelectSubTab',
				isSelectSubTab: match[3]
			})
			dispatch({
				type: action,
				pagination: 1
			})
			
		}
		// user manage init-----------------------
		if(pathname.search('manage')!== -1){
			dispatch({
				type: 'upload/get/token'
			})
			dispatch({
				type: 'upload/init'
			})
			dispatch({
				type: 'user/get/userVideo',
				pagination: 1
			})
		}
		// ---search init-------------------------
		if(pathname.search('search')!== -1){
			const match = pathToRegexp('/search/#!/:menu/:keyword/:pagination/').exec(pathname+hash)
			dispatch({
				type: 'user/get/search',
				context: match[1],
				pagination: match[3],
				body:{
					key_words: match[2]
				}
			})
		}
	})
	return(
	<Router history={history}>
		<Route path="/index" component={Index}>
			<Redirect from="/" to="/index" />
		</Route>
		<Route path="/category/" component={Category}>
			<Route path="video/" />
			<Route path="text/"  />
			<Route path="test/"  />
			<Route path="forum/" />
		</Route>
		<Route path="/detail/" component={Detail}>
			<Route path="video/:id/" />
			<Route path="text/:id/" />
			<Route path="test/:id/" />
			<Route path="*" component={NotFound}  />
		</Route>
		<Route path="/post/:id/" component={PostDetail} />
		<Route path="/user/:id/" component={User}>
		</Route>
		<Route path="/register/" component={Register}>
		</Route>
		<Route path="/login/" component={Login}>
		</Route>
		<Route path="/play/">
			<Route path="video/:courseId/:videoId/" component={PlayVideo}  />
			{/*<Route path="text/:id/" component={PlayText}  />*/}
			<Route path="test/:testId/:recordId/" component={PlayTest}  />
			<Route path="*" component={NotFound}  />
		</Route>
		<Route path="/manage/" component={Manage}>
		</Route>
		<Route path="/search/" component={Search}>
		</Route>
		{/*<Route path="/actived" component={App} />*/}
		{/*<Route path="/completed" component={App} />*/}
		<Route path="/demo" component={App}/>
		<Route path="*" component={NotFound}/>

	</Router>
	)

}

Routes.propTypes = {
	history: PropTypes.any,
};

function mapStoretoPorp(){
	return({})
}

export default connect(mapStoretoPorp)(Routes);
