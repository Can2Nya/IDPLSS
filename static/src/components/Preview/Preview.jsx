import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button } from 'antd';
import classNames from 'classnames';

import styles from './Preview.less';

const Preview = ({ type }) => {
	const PreviewCls = () =>{
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
		<div className={styles.preview}>
		<div className={PreviewCls()} >
		</div>
		<div className={styles.contant}>
		<div className={styles.text}>xxxxxxxbiaotixxxxxx</div>
		<Button className={styles.button}>开始浏览</Button>
		</div>
		</div>
	);
};

Preview.propTypes = {  
	
};

export default Preview;