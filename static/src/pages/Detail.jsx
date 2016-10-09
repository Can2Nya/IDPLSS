import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Col, Icon, Tabs } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Layout from '../layouts/Layout/Layout';

import Title from '../components/Title/Title';
import Menu from '../components/Menu/Menu';
import List from '../components/List/List';
import Comment from '../components/Comment/Comment';
import InputForm from '../components/InputForm/InputForm';
import Preview from '../components/Preview/Preview';

import DetailPannel from '../layouts/DetailPannel/DetailPannel';

import styles from './commont.less';

const Detail = ({ context, user, dispatch, location }) => {
	const { stateName, isSelectContext } = context
	const { list } = user

	// -------------action----------------
	const handlePostSubmit = (form, value, e) => {//评论表单提交(参数顺序不能反)
		e.preventDefault();
		form.validateFields((errors, values) => {
			if (!!errors) {
				return;
			}
			if (user.list <= 0) return;
			dispatch({
				type: `${stateName}/post/comment`,
				body: value['body'],
				author_id: list.user_id,
				id: isSelectContext.id,
				//这个id可以指各种区域需要的字段,字段名在对应的reducers接收

			})
		});
	}

	const handlePostDelete = (id, e) =>{
		// if ((list.user_type == 2 && list.user_id == isSelectContext.context.author_id) || (list.user_type >= 3)){
		// 	// 第二道防线
		// 	dispatch({
		// 		type: `${stateName}/delete/comment`,
		// 		commentid: id,
		// 	})
		// }

	}
	// -------------fuc-------------------------
	const handleTabsLink = ({...e}) =>{
		/*e为点击事件，包含tabs的key(然而键并不是key：xxx)
		console.log(e[0])*/
		const hash = (key) =>{
			switch(key){
				case '1': return '#!/series/';
				case '2': return '#!/comment/';
			}
		}
		return window.location.hash = hash(e[0]);
	}
	const handleActiveTab = () =>{
		switch(location.hash){
			case '#!/series/': return '1';
			case '#!/comment/': return '2';
		}
	}
	// -----------------render----------------------
	const renderList = () =>{
		if(isSelectContext.loading){
			return <Spin />;
		}
		if(isSelectContext.list <= 0 || !isSelectContext.list){
			return;
		}
		if(location.search('register')!== -1){
			return isSelectContext.list.map((video,index) =>{
				if(!video.show) return
				return(
					<List>{ video['video_name'] }</List>
				);
			})
		}
	}
	return (
		<Layout location={location}>
			<div className={styles.contain}>
			<div className={styles.margin}>
			<Row>
			<div className={styles.margin}>
				<Breadcrumb>
							<Breadcrumb.Item>
							<Icon type="home" />
							</Breadcrumb.Item>
							<Breadcrumb.Item>
							{ context.categoryTitle }
							</Breadcrumb.Item>
				
				</Breadcrumb>
			</div>
			<Col span={8} lg={7}>
			<Preview type='video' />
			</Col>

			<Col span={16} lg={17} >
			<div className={styles.detail}>
			<DetailPannel>
				<div className={styles.tabpannel}>
				<Tabs onTabClick={handleTabsLink.bind(this)} activeKey={handleActiveTab()}>
				<Tabs.TabPane tab='列表' key={1} >
					<List>
					11111111111
					</List>
				</Tabs.TabPane>
				<Tabs.TabPane tab='评论' key={2} >

					<InputForm 
					onSubmit={handlePostSubmit}
					user={user}/>

					<Comment 
					onDelete={handlePostDelete}/>
				</Tabs.TabPane>
				</Tabs>
				</div>
			</DetailPannel>
			</div>
			</Col>
			</Row>
			</div>
			</div>
		</Layout>
	);
};

Detail.PropTypes = {

};

function mapStateToProp({video,text,test,user},{ location,}){//参数一可追加
	const state = () =>{
		const witch = pathToRegexp('/detail/:context/:id/').exec(location.pathname)
		
		switch(witch[1]){
			case 'video': return video;
			case 'test': return test;
			case 'text': return text;
			default: return;
		}

	}
	return {
	 context: state(),//context为当前读取的store（video，text，test）
	   user: user,
	};
};

export default connect(mapStateToProp)(Detail);