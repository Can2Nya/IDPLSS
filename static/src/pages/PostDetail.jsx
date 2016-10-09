import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon } from 'antd';
import { connect } from 'react-redux';
import pathToRegexp from 'path-to-regexp';
import Layout from '../layouts/Layout/Layout';

import Comment from '../components/Comment/Comment';
import InputForm from '../components/InputForm/InputForm';

import PostDetailPannel from '../layouts/PostDetailPannel/PostDetailPannel';

import styles from './commont.less';

const PostDetail = ({ forum, user, dispatch, location }) => {
	const { stateName, isSelectContext } = forum

	// -------------action----------------
	const handlePostSubmit = (form, value, e) => {//评论表单提交(参数顺序不能反)
		e.preventDefault();
		form.validateFields((errors, values) => {
			if (!!errors) {
				return;
			}
			if (user.list <= 0) return;
			// dispatch({
			// 	type: 'video/post/comment',
			// 	body: value['body'],
			// 	author_id: user.list.user_id,
			// 	course_id: context.isSelectContext.id,
			// })
		});
	}
	const handlePostDelete = (value, e) =>{
		// if ((list.user_type == 2 && list.user_id == isSelectContext.context.author_id) || (list.user_type >= 3)){
		// 	// 第二道防线
		// 	dispatch({
		// 		type: `${stateName}/delete/comment`,
		// 		commentid: id,
		// 	})
		// }

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
				<PostDetailPannel>
					<InputForm user={user} onSubmit={handlePostSubmit.bind(this)}/>
					<Comment onDelete={handlePostDelete.bind(this)}/>
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