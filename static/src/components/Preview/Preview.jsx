import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button } from 'antd';
import classNames from 'classnames';

import styles from './Preview.less';

const Preview = ({ type, data }) => {
	const PreviewCls = () =>{
		if(type == 'video' || type == 'text'){
			if(type == 'text'){
				const textType = ['other','word','excel','pdf','ppt']
				return classNames({
					[styles[textType[data.resource_type]]]: true,
				})
			}
			return classNames({
				[styles[type]]: true,
			})
		}
	};
	
	const renderBg = () =>{
		if(type == 'video') {
			return({
			backgroundImage: `url(${data.images})`
			})
		}
	}

	const renderButton = () =>{
		if(type == 'text'){
			return (
				<Row gutter={8}>
				<Col span={16}>
					<Button className={styles.button}>立即参加</Button>
				</Col>
				<Col span={8}>
					<Button className={styles.button}>下载</Button>
				</Col>
				</Row>
			)
		}
		else return(
			<Button className={styles.button}>立即参加</Button>
		)
	}
	return (
		<div className={styles.preview}>
		<div className={PreviewCls()} style={renderBg()} ></div>
		<div className={styles.contant}>
		<div className={styles.text}>{ data["course_name"] || data['resource_name'] || data['test_title'] }</div>
		
		{ renderButton() }
		
		</div>
		</div>
	);
};

Preview.propTypes = {  
	
};

export default Preview;