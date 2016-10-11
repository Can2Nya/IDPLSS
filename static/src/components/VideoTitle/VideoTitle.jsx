import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon, Tabs, Spin } from 'antd';
import classNames from 'classnames';
// import config from '../../config/config';

import Button from '../Button/Button';

import styles from './VideoTitle.less';

const VideoTitle = ({ location }) => {
	// const titleCls = () =>{
	// 	var style = {}
	// 	if (noline) style[[styles.noline]] = true;
	// 	if (type == 'small') style[[styles.small]] = true;
	// 	if (type == 'big') style[[styles.big]] = true;
		

	// 	return classNames({
	// 		[styles.noline]:noline,
	// 		[styles[type]]:true,
	// 	});
	// };
	// const renderVideoTitle = () =>{
	// 	if (type == 'big') {
	// 		return(
	// 			<div className={styles.right}>
	// 			<img src={config.dot} />
	// 			<Link to="#">
	// 			<span>more</span>
	// 			</Link>
	// 			</div>
	// 		);
	// 	}
	// 	return;
	// };
	return (
		<Row>
		<Col span={24}>
		<div className={styles.title}>
		xxxxxxx视频标题视频标题
		</div>
		</Col>
		<Col span={24}>
		<Row>
		<Col span={5}>
			<Breadcrumb>
						<Breadcrumb.Item>
						<Icon type="home" />
						</Breadcrumb.Item>
						<Breadcrumb.Item>
						<Link to={{ pathname:`${location.pathname}`}}>xxxx</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>
						xxxxx
						</Breadcrumb.Item>
			</Breadcrumb>
		</Col>
		<Col span={5}>
			<div className={styles.time}>xxxxx年x月x日</div>
		</Col>
		<Col span={5}>
			<div className={styles.favor}><Icon type="heart-o" />  收藏</div>
		</Col>
		</Row>
		</Col>
		
		</Row>
	);
};

VideoTitle.propTypes = {  
	
};

export default VideoTitle;