import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Upload, Icon, Modal, Form, Input } from 'antd';

import config from '../../config/config.js';
import styles from './Pannel.less';

const SettingPannel = ({ children, data, title }) => {
	const formItemLayout = {
      	labelCol: { span: 4 },
      	wrapperCol: { span: 14 },
    };
	return(
		<div className={styles.settingpannel}>
		<Row>
		<Form>
		<Col span={5}>
			<Form.Item help="仅限png,jpg,20kb以内">
			<Upload listType="picture-card">
				<Icon type="plus" />
				<div className="ant-upload-text">上传头像</div>
			</Upload>
			</Form.Item>
		</Col>
		<Col span={19}>
			<Form.Item 
			{ ...formItemLayout }
			label="昵称">
				<Input />
			</Form.Item>
			<Form.Item 
			{ ...formItemLayout }
			label="自我描述">
				<Input type="textarea"/>
			</Form.Item>
			<Form.Item 
			{ ...formItemLayout }
			label="新密码">
				<Input />
			</Form.Item>
			
		</Col>
		</Form>
		</Row>
		</div>
	)
};

SettingPannel.propTypes = {
	//children: PropTypes.element.isRequired,
};


export default SettingPannel;
