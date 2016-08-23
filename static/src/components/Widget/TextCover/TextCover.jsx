import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import classNames from 'classnames';

import styles from './TextCover.less';

const TextCover = ({ type }) => {
	const coverCls = () =>{
		if(type == 'word') return styles.word;
		if(type == 'ppt') return styles.ppt;
		if(type == 'pdf') return styles.pdf;
	};
	return (
		<div className={coverCls()}>
			<div className={styles.title}>这是标题
			</div>
			<div className={styles.position}>
			<div className={styles.subtitle}>课程名称</div>
			<div className={styles.subtitle}>教师名称</div>
			</div>
		</div>
	);
};

TextCover.propTypes = {  
	
};

export default TextCover;