import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Tabs } from 'antd';
import classNames from 'classnames';

import styles from './UserBanner.less';

const UserBanner = ({ data }) => {
	const identity = () =>{
		const identityText = ['访客','学生','教师','校级管理员','管理员']
		return identityText[data.user.role_id]
	}
	// const renderUserAvator = {
	// 	backgroundImage: "url("+data.config.qiniu+'/'+data.user.user_avatar+")"
	// }
	return (
		<div className={styles.pannel} >
		<div className={styles.avatar} style={{ backgroundImage: `url(${data.config.qiniu}/${data.user.user_avatar})` }}>
		</div>
		<div className={styles.userinfo}>
			<div className={styles.name}>
			{ data.user.name }
			</div>
			<div className={styles.introduce}>
			<span>{ identity() }</span><br />
			{ data.user.user_about_me }
			</div>
		</div>
		</div>
	);
};

UserBanner.propTypes = {  
	
};

export default UserBanner;