import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';

import TimeLine from '../../components/TimeLine/TimeLine';
import config from '../../config/config.js';
import styles from './Pannel.less';

const UpLoadPannel = ({ children, data }) => {

  return (
	<div className={styles.uploadpannel}>
	  <Row>
		<Col span={17}>
			<TimeLine />
		</Col>
		<Col span={7}>
			<div className={styles.userinfo}>
				<div className={styles.row}>
					<span className={styles.big}>
					关注
					<span>{ data.user.user_followings }</span>
					</span>
					<span className={styles.big}>
					粉丝
					<span>{ data.user.user_followers }</span>
					</span>
				</div>
				<div className={styles.row}>
					<span className={styles.small}>
					uid
					<span>{ data.user.user_id }</span>
					</span>
				</div>
				<div className={styles.row}>
					<span className={styles.small}>
					邮箱
					<span>{ data.user.user_email }</span>
					</span>
				</div>
				<div className={styles.row}>
					<span className={styles.small}>
					注册时间
					<span>{ data.user.user_member_since }</span>
					</span>
				</div>
				<div className={styles.row}>
					<span className={styles.small}>
					最后一次登录
					<span>{ data.user.user_last_seen }</span>
					</span>
				</div>
			</div>
		</Col>
	  </Row>
	</div>
  );
};

UpLoadPannel.propTypes = {
  //children: PropTypes.element.isRequired,
};


export default UpLoadPannel;
