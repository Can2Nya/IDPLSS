import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';

import User from '../Navs/User/User';
import Massage from '../Navs/Massage/Massage';

import styles from './Banner.less';

const Banner = ({ config }) => {
	return (
		<div className={styles.hight}>
			<Row  type='flex'
						align='middle'
			>
				<Col span={6}>
					<img src={ config.logo } />
				</Col >
				<Col span={2}
						 offset={14}
				>
					<Massage >
					</Massage>
				</Col>
				<Col span={2}>
					<User textStyle={{ color: '#523552'}}>
					</User>
				</Col>
			</Row>
		</div>
		);
}

Banner.propTypes = {  
	
};

export default Banner;