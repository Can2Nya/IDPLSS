import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, Redirect } from 'react-router';
import { connect } from 'react-redux';
import pathToRegexp from 'path-to-regexp';

import App from '../components/App';
import Index from '../pages/Index'
import Category from '../pages/Category';
import Detail from '../pages/Detail';
import PostDetail from '../pages/PostDetail';
import Register from '../pages/Register';
import User from '../pages/User';
import NotFound from '../pages/NotFound';

//import { initPageStore } from './initPageStore';

const Routes = ({ history, dispatch }) =>{
	//initPageStore(history,dispatch);
	history.listen(({ pathname, hash }) =>{
		//分类页初始化-------------------
		if(pathname.search('category')!== -1){
			const matchpathname = pathToRegexp('/category/:context/').exec(pathname)
			const context = matchpathname[1];
			dispatch({
				type: `${context}/init/`
			})
			if(hash){
				const match = pathToRegexp('#!/:category/:pagination').exec(hash);
				const category = parseInt(match[1]);
				const pagination = parseInt(match[2]);
				dispatch({
					type: `${context}/init/commplete`,
					category: category,
					pagination: pagination,
				})
			}
			else{
				dispatch({
					type: `${context}/init/commplete`,
					category: 0,
					pagination: 1,
				})
			}
			dispatch({
				type: `${context}/get/categorySource`
			})
		}
		//end------------------------
	})
	return(
	<Router history={history}>
		<Route path="/index" component={Index}>
			<Redirect from="/" to="/index" />
		</Route>
		<Route path="/category/" component={Category}>
			<Route path="video/" >
			</Route>
			<Route path="text/"  />
			<Route path="test/"  />
			<Route path="forum/" />
		</Route>
		<Route path="/detail/:id/" component={Detail}>
		</Route>
		<Route path="/post/:id/" component={PostDetail} />
		<Route path="/user/:id/" component={User}>
		</Route>
		<Route path="/register/" component={Register}>
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

function mapStoretoPorp({ store }){
	return({
		store: store,
	})
}

export default connect(mapStoretoPorp)(Routes);
