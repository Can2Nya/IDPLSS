import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Spin, Pagination, Row, Col, Icon } from 'antd';
import { connect } from 'react-redux';
import pathToRegexp from 'path-to-regexp';
import Layout from '../layouts/Layout/Layout';

import Comment from '../components/Comment/Comment';
import InputForm from '../components/InputForm/InputForm';

import PostDetailPannel from '../layouts/PostDetailPannel/PostDetailPannel';

import styles from './commont.less';

const PostDetail = ({ forum, user, dispatch, location }) => {
	const { stateName, isSelectContext } = forum
	const { total, context, comment } = isSelectContext
	const { id } = context
	// -------------action----------------
	const handlePostSubmit = (form, value, e) => {//评论表单提交(参数顺序不能反)
		e.preventDefault();
		form.validateFields((errors, values) => {
			if (!!errors) {
				return;
			}
			if (user.list <= 0) return;
			dispatch({
				type: 'forum/post/comment',
				id: id,
				body: { body: value['body'], author_id: user.loginUserList.user_id, post_id: id}
			})
		});
	}
	const handlePostDelete = (commentid, authorid, e) =>{
		if ((user.loginUserList.user_type == 2 && user.loginUserList.user_id == context.author_id) || (user.loginUserList.user_type >= 3) || (user.loginUserList.user_id == authorid)){
			// 第二道防线
			dispatch({
				type: `forum/delete/comment`,
				id: id,
				comment_id: commentid,
			})
		}

	}
	const handleChangePagination = (page) =>{
		window.location.hash = `#!/${page}/`
	}
	// ------------render------------------------
	const renderCommentList = () =>{
		if(isSelectContext.loading){
			return <Spin />;
		}
		if(comment.length <= 0 || !comment){
			return;
		}
		return comment.map((comment,index) =>{
			if(!comment.show) return
			return(
				<Comment key={index} data={comment} user={{ 
					authorid: context.author_id, 
					loginid: user.loginUserList.user_id, 
					logintype: user.loginUserList.user_type}}  onDelete={handlePostDelete.bind(this)}/>
			);
		})
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
							{ forum.categoryTitle }
							</Breadcrumb.Item>
				
				</Breadcrumb>
			</div>
			<Col span={16} lg={17} >
				<PostDetailPannel data={context}>
					<InputForm user={user} onSubmit={handlePostSubmit.bind(this)}/>
					{ renderCommentList() }
					<Pagination total={total} current={20} onChange={handleChangePagination.bind(this)}/>
				</PostDetailPannel>
			</Col>
			</Row>
			</div>
			</div>
		</Layout>
	);
};

PostDetail.PropTypes = {

};

function mapStateToProp({forum,user},{ location,}){//参数一可追加
	return {
	 	forum: forum,//context为当前读取的store（video，text，test）
		user: user,
	};
};

export default connect(mapStateToProp)(PostDetail);