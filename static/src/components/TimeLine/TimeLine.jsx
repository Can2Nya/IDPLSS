import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Tabs } from 'antd';
import classNames from 'classnames';

import styles from './TimeLine.less';

const TimeLine = ({ data }) => {
	return (
		<div className={styles.pannel} >
		<Row>
		<Col span={4}>
			
		</Col>
		<Col span={20}>
		<div className={styles.dot}>
		</div>
		<div className={styles.context}>
			<div className={styles.time}>
			xxxxxxxxxxxx
			</div>
			<div className={styles.text}>
			xxxxxxxxxxxx
			</div>
		</div>
		</Col>
		</Row>
		</div>
		
	);
};

TimeLine.propTypes = {  
	
};

export default TimeLine;
