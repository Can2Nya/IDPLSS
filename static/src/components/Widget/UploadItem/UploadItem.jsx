import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Icon } from 'antd';
import classNames from 'classnames';

import styles from './UploadItem.less';

const UploadItem = ({ data }) => {
	
	return (
		<div className={styles.block}>
		<Row type='flex' align='middle'>
		<Col span={22}>
		<div className={styles.title}>
		{ data['resource_name'] || data['course_name'] || data['test_title']}
		</div>
		</Col>
		<Col span={2}>
		<Icon type="edit" />
		</Col>
		</Row>
		</div>
	);
};

UploadItem.propTypes = {  
	
};

export default UploadItem;