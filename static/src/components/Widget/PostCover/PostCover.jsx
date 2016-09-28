import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import classNames from 'classnames';

import styles from './PostCover.less';

const PostCover = ({ type, commenttype }) => {
	const coverCls = () =>{
		/*if(type == 'small') return styles.small;
		if(type == 'big') return styles.big;*/
		return classNames({
			[styles[type]]:true,
		})
	};
	const renderTypeIcon = () =>{
		switch(commenttype){
			case 'study': return (<div className={styles.typeicon}>&#xe606;</div>);
			case 'game': return (<div className={styles.typeicon}>&#xe601;</div>);

		}
	}

	const renderPostCover = () =>{
		if (type == 'small') return <div className={styles.title}>帖子标题</div>
			;
		if (type == 'big') return <Row type="flex" align="middle" gutter={16}>
			<Col span={2}>
				{ renderTypeIcon() }
			</Col>
			<Col span={20}>
			<div className={styles.title}>帖子</div>
			<div style={{ margin: '15px 0 0 0'}}>
				<div className={styles.avatar}></div>
				<span className={styles.username}>发帖人 at time</span>
			</div>
			</Col>
			<Col span={2} style={{ textAlign:'center' }}>
			<div className={styles.icon}>
			&#xe604;
			</div>
			<div className={styles.subtitle}>11</div>
			
			</Col>
			</Row>
		;
	}
	return (
		<div className={coverCls()}>
			{renderPostCover()}
		</div>
	);
};

PostCover.propTypes = {  
	
};

export default PostCover;