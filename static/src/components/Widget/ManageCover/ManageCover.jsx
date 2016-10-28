import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Icon } from 'antd';
import classNames from 'classnames';

import Button from '../../Button/Button';

import styles from './ManageCover.less';

const ManageCover = ({ type, data, onClickEdit, onDelete }) => {
	
	return (
		<div className={styles.block}>
			<Row>
				<Col span={7}>
					<div className={styles.preview}>
					</div>
				</Col>
				<Col span={15}>
					<div className={styles.title}>
					xxxxxxxxx标题
					</div>
					<div className={styles.time}>
					xxxxxxxx时间
					</div>
					<div className={styles.button}>
					<span>
					<Button type='primary' onClick={onClickEdit}>编辑</Button>
					</span>
					<span>
					<Button type='ghost' onClick={onDelete}>删除</Button>
					</span>
					</div>
				</Col>
				<Col span={2}>
					<div className={styles.icon}><Icon type="play-circle-o" /><br />0</div>
				</Col>
			</Row>
		</div>
	);
};

ManageCover.propTypes = {  
	
};

export default ManageCover;