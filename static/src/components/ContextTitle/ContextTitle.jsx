import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon, Tabs, Spin } from 'antd';
import classNames from 'classnames';
// import config from '../../config/config';

import Button from '../Button/Button';

import styles from './ContextTitle.less';

const ContextTitle = ({ location, data, type }) => {
	const { isSelectContext, category } = data
	const renderTime = () =>{
		if(type == 'video'){
			const { context } = isSelectContext.isSelectContext
			return context.timestamp;
		}
		if(type == 'test'){
			const { context } = isSelectContext
			return context.timestamp
		}
	}
	const renderTitle = () =>{
		if(type == 'video'){
			const { context } = isSelectContext.isSelectContext
			return context.video_name;
		}
		if(type == 'test'){
			const { context } = isSelectContext
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
						<Link to={{ pathname:`${location.pathname}`}}>{ category[isSelectContext.context.test_category+1 || isSelectContext.context.course_category+1] }</Link>
						</Breadcrumb.Item>
			</Breadcrumb>
		</Col>
		<Col span={5}>
			<div className={styles.time}>{renderTime()}</div>
		</Col>
		<Col span={5}>
			{/*<div className={styles.favor}><Icon type="heart-o" />  喜欢</div>*/}
		</Col>
		</Row>
		</Col>
		
		</Row>
	);
};

ContextTitle.propTypes = {  
	
};

export default ContextTitle;