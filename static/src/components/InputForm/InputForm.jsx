import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Form, Input } from 'antd';
import classNames from 'classnames';

import styles from './InputForm.less';

const InputForm = () => {
	/*const InputFormCls = () =>{
		/*var style = {};
		if(type == 'video') style[[styles.video]] = true;
		if(type == 'word') style[[styles.word]] = true;
		if(type == 'ppt') style[[styles.ppt]] = true;
		if(type == 'pdf') style[[styles.pdf]] = true;

		return classNames({
			[styles[type]]:true
		});
	};*/
	return (
		<div className={styles.inputform}>
		<Row>
		<Col span={3} lg={2}>
			<div className={styles.avatar}>
			</div>
		</Col>
		<Col span={21} lg={22}>
		<div className={styles.input}>
		<Form>
			<div className={styles.triangle}>
			</div>
			<div className={styles.inputbody}>
				<Form.Item>
					<Input type="textarea" placeholder="请输入文字" autosize={{ minRows: 4, maxRows: 6 }} />
				</Form.Item>
			</div>
			<div className={styles.inputtool}>
			<Button className={styles.submit}>
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

InputForm.propTypes = {  
	
};

export default InputForm;