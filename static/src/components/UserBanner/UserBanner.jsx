import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Tabs } from 'antd';
import classNames from 'classnames';

import styles from './UserBanner.less';

const UserBanner = () => {
	/*const UserBannerCls = () =>{
		/*var style = {};
		if(type == 'video') style[[styles.video]] = true;
		if(type == 'word') style[[styles.word]] = true;
		if(type == 'ppt') style[[styles.ppt]] = true;
		if(type == 'pdf') style[[styles.pdf]] = true;

		return classNames({
			[styles[type]]:true
		});
	};*/
	return (
		<div className={styles.pannel}>
		<div className={styles.avatar}>
		</div>
		<div className={styles.userinfo}>
			<div className={styles.name}>
			用户名
			</div>
			<div className={styles.introduce}>
			<span>身份</span>
			xxxxxxxxxxxx
			</div>
		</div>
		</div>
	);
};

UserBanner.propTypes = {  
	
};

export default UserBanner;