import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Form, Input } from 'antd';
import classNames from 'classnames';

import styles from './InputForm.less';
import config from '../../config/config.js'

let InputForm = ({ form, user, onSubmit }) => {
	const { getFieldProps, validateFields, getFieldValue, getFieldsValue } = form;

	const bodyProps = getFieldProps('body', {
		rules: [
			{ required: true, min: 10, message: '内容至少 10 个字符' },
		],
	});
	const renderUserAvatar = ()=> {
		if(user.loginUserList['user_avatar']) return <div className={styles.avatar} style={{ backgroundImage: `url(${config.qiniu}/${user.loginUserList['user_avatar']})`}}></div>
		else return <div className={styles.avatar}></div>
	}

	const renderNoUser = () =>{
		if(user.loginUserList <= 0) return <div className={styles.nouser}>登录后可评论</div>;
		else return <Input type="textarea" { ...bodyProps } placeholder="请输入文字" autosize={{ minRows: 4, maxRows: 4 }} />
	}
	return (
		<div className={styles.inputform}>
		<Row>
		<Col span={3} lg={2}>
			{renderUserAvatar()}
		</Col>
		<Col span={21} lg={22}>
		<div className={styles.input}>
		<Form>
			<div className={styles.triangle}>
			</div>
			
			<div className={styles.inputbody}>
				<Form.Item>
				{ renderNoUser() }
					
				</Form.Item>
			</div>
			<div className={styles.inputtool}>
			<Button className={styles.submit} onClick={onSubmit.bind(this, form , getFieldsValue())}>
			提交
			</Button>
			</div>
		</Form>
		</div>
		</Col>
		</Row>
		</div>
	);
};

InputForm = Form.create()(InputForm)

InputForm.propTypes = {  
	
};

export default InputForm;