import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import classNames from 'classnames';

import styles from './VideoCover.less';

const VideoCover = ({ type, data }) => {
	const coverCls = () =>{
		/*if(type == 'small') return styles.small;
		if(type == 'big') return styles.big;*/
		return classNames({
			[styles[type]]:true,
		})
	};
	return (
		<div className={coverCls()}>
			<div className={styles.img} style={{backgroundImage:'url('+1+')'}}>
				<div className={styles.showmun}>
					<span>&#xe60e; </span>
					<span>1111</span>
				</div>
			</div>
			<div className={styles.title}>{ /*data.course_name*/ }</div>
			<div className={styles.user}>{ /*data.author_id*/ }</div>
		</div>
	);
};

VideoCover.propTypes = {  
	
};

export default VideoCover;