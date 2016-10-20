import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Breadcrumb, Pagination, Row, Col, Icon, Tabs, Spin } from 'antd';
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
	const { total, comment } = isSelectContext
	const { id } = isSelectContext.context

	const { loginUserList } = user

	// -------------action----------------
	const handlePostSubmit = (form, value, e) => {//评论表单提交(参数顺序不能反)
		e.preventDefault();
		form.validateFields((errors, values) => {
			if (!!errors) {
				return;
			}
			if (loginUserList.length <= 0) return;
			// video->course_id,text->text_resource_id
			let pram = {
				video: 'course_id',
				text: 'text_resource_id'
			}

			let body = {}
			body['body'] = value.body
			body['author_id'] = loginUserList.user_id
			body[pram[stateName]] = id

			dispatch({
				type: `${stateName}/post/comment`,
				id: id,
				body: body
				// body: { body: value['body'], author_id: loginUserList.user_id, `${pram[stateName]}`: id}
				// body: value['body'],
				// author_id: loginUserList.user_id,
				// id: isSelectContext.id,
				//这个id可以指各种区域需要的字段,字段名在对应的reducers接收

			})
		});
	}

	const handlePostDelete = (commentid, authorid, e) =>{
		if ((user.loginUserList.user_type == 2 && user.loginUserList.user_id == isSelectContext.context.author_id) || (user.loginUserList.user_type >= 3) || (user.loginUserList.user_id == authorid)){
			// 第二道防线
			dispatch({
				type: `${stateName}/delete/comment`,
				id: id,
				comment_id: commentid,
			})
		}
	}
	const handleChangePagination = (page) =>{
		if(location.hash.search(series) !== -1) window.location.hash = `#!/series/${page}`
		if(location.hash.search(comment) !== -1) window.location.hash = `#!/comment/${page}`
		
	}
	// -------------fuc-------------------------
	const handleTabsLink = ({...e}) =>{
		/*e为点击事件，包含tabs的key(然而键并不是key：xxx)
		console.log(e[0])*/
		const hash = (key) =>{
			switch(key){
				case '1': return '#!/series/1/';
				case '2': return '#!/comment/1/';
			}
		}
		window.location.hash = hash(e[0]);
	}
	const handleActiveTab = () =>{
		if(location.hash.search('series') !== -1) return '1'
		if(location.hash.search('comment') !== -1) return '2'
			// case '#!/series/': return '1';
			// case '#!/comment/': return '2';
	}
	// -----------------render----------------------
	const renderList = () =>{
		if(isSelectContext.loading){
			return <Spin />;
		}
		if(location.hash.search('series')!== -1){
			if(isSelectContext.list.length <= 0){
				return <div>暂时还未有内容</div>;
			}
			return isSelectContext.list.map((list,index) =>{
				if(!list.show) return
				return(
					<List key={index}>{ list['video_name'] || list['problem_description'] }</List>
				);
			})
		}
		if(location.hash.search('comment')!== -1){
			if(isSelectContext.comment.length <= 0){
				return <div>暂时还未有评论</div>;
			}
			return isSelectContext.comment.map((comment,index) =>{
				if(!comment.show) return
				return(
					<Comment key={index} data={comment} user={{ 
					authorid: isSelectContext.context.author_id, 
					loginid: user.loginUserList.user_id, 
					logintype: user.loginUserList.user_type}}  onDelete={handlePostDelete.bind(this)}/>
				);
			})
		}
	}
	const renderIsDisableSeries = () =>{// 是否禁用系列列表
		if(stateName == 'text') return true;
		return false;
	}
	const renderIsDisableComment = () =>{
		if(stateName == 'test') return true;
		return false;
	}
	// ----------------------------------------------
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
			<Preview type={`${stateName}`} data={ isSelectContext.context } />
			</Col>

			<Col span={16} lg={17} >
			<div className={styles.detail}>
			<DetailPannel data={ isSelectContext.context } >
				<div className={styles.tabpannel}>
				<Tabs onTabClick={handleTabsLink.bind(this)} activeKey={handleActiveTab()}>
				<Tabs.TabPane tab='列表' key={1} disabled={renderIsDisableSeries()}>
					{ renderList() }
					<Pagination current={20} total={total} onChange={handleChangePagination} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='评论' key={2} disabled={renderIsDisableComment()}>

					<InputForm 
					onSubmit={handlePostSubmit}
					user={user}/>
					{ renderList() }
					<Pagination current={20} total={total} onChange={handleChangePagination} />
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