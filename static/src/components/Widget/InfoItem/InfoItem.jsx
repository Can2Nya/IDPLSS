import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Icon, Form, Modal, Select, Radio, Input, Button } from 'antd';
import classNames from 'classnames';

// import Button from '../../Button/Button';
// import config from '../../config/config.js';
import styles from './InfoItem.less';

let InfoItem = ({ type, data, onChange, onDelete, onAssign }) => {
	
	// -----------form rule-----------------

	// ------------render-------------------
	const renderUser = ()=>{
		const identityText = ['','管理员','校级管理员','教师','学生','访客']
		// return [
		// <div key='1'>{data.user_id}</div>,
		// <div key='2'>{data.user_name}</div>,
		// <div key='3'>{data.name}</div>,
		// <div key='4'>{data.user_email}</div>,
		// <div key='5'>{identityText[data.role_id]}</div>,
		// <Button key='6'>分配权限</Button>
		// ]
		return (
			<Row gutter={16}>
				<Col span={4}>{data.user_id}</Col>
				<Col span={4}>{data.user_name}</Col>
				<Col span={4}>{data.name}</Col>
				<Col span={4}>{data.user_email}</Col>
				<Col span={4}>{identityText[data.role_id]}</Col>
				<Col span={4}><Button onClick={onAssign.bind(this,data)}>分配权限</Button></Col>
			</Row>
		)
	}
	const renderList = ()=>{
		if(type == 'user') return renderUser()
	}
	
	return (
		<div className={styles.block}>
			{renderList()}
		</div>
	);
};

InfoItem.propTypes = {  
	
};

export default InfoItem;