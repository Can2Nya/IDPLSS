import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button } from 'antd';
import classNames from 'classnames';

import styles from './Preview.less';

const Preview = ({ type, data }) => {
	const PreviewCls = () =>{
		/*var style = {};
		if(type == 'video') style[[styles.video]] = true;
		if(type == 'word') style[[styles.word]] = true;
		if(type == 'ppt') style[[styles.ppt]] = true;
		if(type == 'pdf') style[[styles.pdf]] = true;*/
		if(type == 'video' || type == 'text'){
			if(type == 'text'){
				const textType = ['other','word','excel','pdf','ppt']
				return classNames({
					[styles[textType[data.resource_type]]]: true,
				})
			}
			// styles['image'] = {}
			return classNames({
				[styles[type]]: true,
			})
		}
	};
	// const PreviewVideoBg = {
	// 	backgroundImage: `url(${data.images})`,
	// }
	// const renderBg = () =>{
	// 	if(!!data['images'] && type == 'video') {
	// 		// return({
	// 		// backgroundImage: `url(${data.images})`
	// 		// })
	// 		console.log(data)
	// 		return <div className={PreviewCls()} style={{ backgroundImage: `url(${data.images})` }} ></div>
	// 	}
	// 	console.log('3')
	// 	return <div className={PreviewCls()}></div>
	// }
	return (
		<div className={styles.preview}>
		<div className={PreviewCls()} style={{backgroundImage: `url(${data.images})`,}} ></div>
		<div className={styles.contant}>
		<div className={styles.text}>{ data["course_name"] || data['resource_name'] }</div>
		<Button className={styles.button}>开始浏览</Button>
		</div>
		</div>
	);
};

Preview.propTypes = {  
	
};

export default Preview;