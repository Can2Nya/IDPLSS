import React, { Compont,PropTypes } from 'react';
import { Popover, Modal, Form, Input } from 'antd';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import classNames from 'classnames';
import cookie from 'js-cookie';
import base64 from 'base-64';

import Layout from '../layouts/Layout/Layout';
import CommentContext from '../layouts/CommentContext/CommentContext';

import Button from '../components/Button/Button';

import styles from './commont.less';

let Login = ({ form, user, dispatch }) => {
	const { getFieldProps } = form;
	// ------------rule-----------------
	const formItemLayout = {
	   labelCol: { span: 4 },
	   wrapperCol: { span: 14 },
	};
	// ----------action----------------
	const handleLogin = ()=>{
		const data = form.getFieldsValue();
		cookie.set('authorization','Basic '+base64.encode(data.username+":"+data.password))
		dispatch({
			type: 'user/login',
			body: { user_name_or_email: data.username, user_password: data.password }
		})
	}

	return (
	<Layout location={location}>
	<CommentContext title='登陆'>
	<Form>
		<Form.Item 
		{...formItemLayout}
		label="用户名" key='1' >
			<Input {...getFieldProps('username',{})} type='text' />
		</Form.Item>
		<Form.Item 
		{...formItemLayout}
		label="密码" key='2' >
			<Input {...getFieldProps('password',{})} type='password' />
		</Form.Item>
		<Form.Item>
			<Button type='ghost' onClick={handleLogin.bind(this)}>登陆</Button>
		</Form.Item>
	</Form>
	</CommentContext>
	</Layout>
	);
};
Login = Form.create()(Login)

function mapStateToProps({ user }){
	return {
		user: user,
	};
};

export default connect(mapStateToProps)(Login);
