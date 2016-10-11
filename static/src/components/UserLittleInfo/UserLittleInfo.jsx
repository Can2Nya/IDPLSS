import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Tabs } from 'antd';
import classNames from 'classnames';

import styles from './UserLittleInfo.less';

const UserLittleInfo = ({ data }) => {
	// const isStatus = () =>{
	// 	return data.user.user_type? '教师': '学生';
	// }
	// const renderUserAvator = {
	// 	backgroundImage: "url("+data.config.qiniu+'/'+data.user.user_avatar+")"
	// }
	return (
		<div className={styles.pannel} >
		<div className={styles.avatar}>
		</div>
		<div className={styles.userinfo}>
			<div className={styles.name}>
			name
			</div>
			<div className={styles.introduce}>
			xxxxx
			</div>
		</div>
		</div>
	);
};

UserLittleInfo.propTypes = {  
	
};

export default UserLittleInfo;