import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon, Tabs, Spin } from 'antd';
import classNames from 'classnames';
// import config from '../../config/config';

import Button from '../Button/Button';

import styles from './ContextTitle.less';

const ContextTitle = ({ location, data, index }) => {
	const { isSelectContext, category } = data
	const { context } = isSelectContext
	// const { id, problemId, testRecordId, isSubmit, isCorrect, isComplete, status } = isSelectContext.isSelectContext
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
	// const renderContextTitle = () =>{
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
	const renderTitle = () =>{
		if(index !== undefined && isSelectContext){
			return isSelectContext.list[index].video_name;
		}
		else {
			return context.test_title
		}
	}
	return (
		<Row>
		<Col span={24}>
		<div className={styles.title}>
		{ renderTitle() }
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
						{/*<Link to={{ pathname:`${location.pathname}`}}>{ category[context.test_category] }</Link>*/}
						</Breadcrumb.Item>
			</Breadcrumb>
		</Col>
		<Col span={5}>
			<div className={styles.time}>{ context.timestamp }</div>
		</Col>
		<Col span={5}>
			<div className={styles.favor}><Icon type="heart-o" />  收藏</div>
		</Col>
		</Row>
		</Col>
		
		</Row>
	);
};

ContextTitle.propTypes = {  
	
};

export default ContextTitle;