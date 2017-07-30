import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Tabs } from 'antd';
import classNames from 'classnames';

import styles from './TimeLine.less';

const TimeLine = ({ data, onChangeVideo }) => {
	return (
		<div className={styles.pannel} >
		<Row>
		<Col span={4}>
			<div className={styles.subtitle}>{`第${data.video_order}课`}</div>
		</Col>
		<Col span={20}>
		<div className={styles.dot}>
		</div>
		<div className={styles.context}>
			<a onClick={onChangeVideo.bind(this,data.id)}>
			<div className={styles.title}>
			{ data.video_name }
			</div>
			</a>
			<div className={styles.text}>
			{ data.video_description }
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
