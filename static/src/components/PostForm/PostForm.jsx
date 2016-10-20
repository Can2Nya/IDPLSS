import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Form, Input, Select, Modal } from 'antd';
import classNames from 'classnames';

import Button from '../Button/Button';

import styles from './PostForm.less';

const PostForm = ({ visible, confirmLoading, onClick, onCancel, onOk }) => {
	return (
		<div >
		{/*<Button type="ghost" onClick={ onClick.bind(this) } >
		发布帖子
		</Button>*/}
		<div className={styles.block} onClick={ onClick.bind(this) }>
			发布帖子
		</div>
		<Modal title='发布帖子' 
		width={960} 
		visible={visible} 
		confirmLoading={confirmLoading}
		onCancel={onCancel.bind(this)}
		onOk={onOk.bind(this)}
		>

			<Row>
			<Col span={4}>
				<Select style={{ width: '100%' }}>
					<Select.Option value="1" key='1'>板块1</Select.Option>
					<Select.Option value="2" key='2'>板块2</Select.Option>
					<Select.Option value="3" key='3'>板块3</Select.Option>
				</Select>
			</Col>
			<Col span={20}>
				<Input />
			</Col>
			</Row>
			<Row>
				<Input type='textarea' />
			</Row>
		</Modal>
		</div>
	);
};

PostForm.propTypes = {  
	
};

export default PostForm;