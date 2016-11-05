import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Tabs } from 'antd';
import classNames from 'classnames';

import InputForm from '../../components/InputForm/InputForm';
import Comment from '../../components/Comment/Comment';

import config from '../../config/config.js'
import styles from './PostDetailPannel.less';

const PostDetailPannel = ({ children, data }) => {
	const PostDetailPannelCls = () =>{
		/*var style = {};
		if(type == 'video') style[[styles.video]] = true;
		if(type == 'word') style[[styles.word]] = true;
		if(type == 'ppt') style[[styles.ppt]] = true;
		if(type == 'pdf') style[[styles.pdf]] = true;*/

		return classNames({
			[styles[type]]:true
		});
	};
	return (
		<div className={styles.pannel}>
		<Row gutter={16}>
		<Col span={5} lg={4}>
			<Link to={{pathname: `/user/${data.author_id}/`, hash: '#!/dynamic/0/' }} ><div className={styles.avatar} style={{backgroundImage: `url(${config.qiniu}/${data.author_avatar})`}}></div></Link>
		</Col>
		<Col span={19} lg={20}>
		<div className={styles.title}>
		{ data.title }
		</div>
		<Link to={{pathname: `/user/${data.author_id}/`, hash: '#!/dynamic/0/' }} >
		<div className={styles.username}>
		{ data.author_name }
		</div>
		</Link>
		<div className={styles.text}>
		<p>{ data.body }</p>
		</div>
		</Col>
		</Row>
		<div className={styles.tool}>
			<div className={styles.icon}>
			<span>&#xe602; 删除</span><span>&#xe60b; 点赞</span>
			</div>
		</div>
		{ children }
		</div>
	);
};

PostDetailPannel.propTypes = {  
	
};

export default PostDetailPannel;