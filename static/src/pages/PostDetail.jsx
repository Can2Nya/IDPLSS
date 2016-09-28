import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon } from 'antd';
import Layout from '../layouts/Layout/Layout';

import Comment from '../components/Comment/Comment';
import InputForm from '../components/InputForm/InputForm';

import PostDetailPannel from '../layouts/PostDetailPannel/PostDetailPannel';

import styles from './commont.less';

const PostDetail = ({ location }) => {
	/*chidren为router*/
	const handleTabsLink = ({...e}) =>{
		/*e为点击事件，包含tabs的key(然而键并不是key：xxx)
		console.log(e[0])*/
		const hash = (key) =>{
			switch(key){
				case '1': return '#!/list/';
				case '2': return '#!/comment/';
			}
		}
		return window.location.hash = hash(e[0]);
	}
	const handleActiveTab = () =>{
		switch(location.hash){
			case '#!/list/': return '1';
			case '#!/comment/': return '2';
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
							全部课程
							</Breadcrumb.Item>
				
				</Breadcrumb>
			</div>
			<Col span={16} lg={17} >
				<PostDetailPannel>
					<InputForm />
					<Comment />
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

export default PostDetail;