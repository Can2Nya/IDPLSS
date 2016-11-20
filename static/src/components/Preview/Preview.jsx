import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Icon } from 'antd';
import classNames from 'classnames';

import styles from './Preview.less';
import config from '../../config/config.js'

const Preview = ({ type, data, isCollect, onCollect, onCollectCancel, onLike }) => {
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
			backgroundImage: `url(${config.qiniu}/${data.images})`
			})
		}
	}

	const renderButton = () =>{
		if(type == 'text'){
			if(data.resource_type == 3){
				return (
					<Row gutter={8}>
					<Col span={16}>
						<a href={`${data.source_url}`}><Button className={styles.button}>预览</Button></a>
					</Col>
					<Col span={8}>
						<a href={`${data.source_url}`} download={`${data.source_url}`}><Button className={styles.button}>下载</Button></a>
					</Col>
					</Row>
				)
			}
			return (
				<a href={`${data.source_url}`} download={`${data.source_url}`}><Button className={styles.button}>下载</Button></a>
			)
		}
		if(type == 'test' ){
			// if(isCollect == false) 
			// return <Button className={styles.button} onClick={onCollect.bind(this)}>立即参加</Button>
			// if(isCollect == true) return <div className={styles.buttonDisable}>已参与答题</div>
			return (
				<Row gutter={8} type='flex' align="middle">
				<Col span={18}>
					<Button className={styles.button} onClick={onCollect.bind(this)}>立即参加</Button>
				</Col>
				<Col span={6}>
					<a onClick={onLike.bind(this)}><Icon type="heart-o" />  喜欢</a>
				</Col>
				</Row>
			)
		}
		if(type == 'video' ){
			if(isCollect == false) return <Button className={styles.button} onClick={onCollect.bind(this)}>立即参加</Button>
			if(isCollect == true) return (
				<Row gutter={8} type='flex' align="middle">
				<Col span={18}>
					<Button className={styles.button} onClick={onCollectCancel.bind(this)}>取消参加</Button>
				</Col>
					<Col span={6}>
						<a onClick={onLike.bind(this)}><Icon type="heart-o" />  喜欢</a>
					</Col>
					</Row>
			)
		}
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