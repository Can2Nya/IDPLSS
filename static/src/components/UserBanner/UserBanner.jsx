import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Tabs } from 'antd';
import classNames from 'classnames';

import styles from './UserBanner.less';

const UserBanner = ({ data }) => {
	const isStatus = () =>{
		return data.user.user_type? '教师': '学生';
	}
	const renderUserAvator = {
		backgroundImage: "url("+data.config.qiniu+'/'+data.user.user_avatar+")"
	}
	return (
		<div className={styles.pannel} >
		<div className={styles.avatar} style={renderUserAvator}>
		</div>
		<div className={styles.userinfo}>
			<div className={styles.name}>
			{ data.user.name }
			</div>
			<div className={styles.introduce}>
			<span>{ isStatus() }</span><br />
			{ data.user.user_about_me }
			</div>
		</div>
		</div>
	);
};

UserBanner.propTypes = {  
	
};

export default UserBanner;