import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Input, Form, Icon, Collapse } from 'antd';
import classNames from 'classnames';

import styles from './SubjectivityTest.less';
import config from '../../../config/config.js'

const SubjectivityTest = ({ time, result, status, data, index, form, onFormChange }) => {

	const { getFieldProps, validateFields, getFieldValue } = form;

	const renderRightAnswer = () =>{
		if(status){
			return <Collapse>
					<Collapse.Panel header={`正确答案：${data.right_answer}`} key="1">
					<p>{data.answer_explain}</p>
					</Collapse.Panel>
					</Collapse>
		}
	}

	const renderProblemStatus = () =>{
		if(result.length > 0){	
			return result[index] ? (
				<Icon type="check-circle" />
			):(
				<Icon type="cross-circle" />
			)
		}
	}
	const renderProblemImage = () =>{
		if(data.description_image == '') return;
		return data.description_image.split(':').map((image,index)=>{
			return <img key={index} height={200} src={`${config.qiniu}/${image}`} />
		})
	}
	return (
		<div className={styles.subjectivityTest}>
			<div className={styles.title}>
			{`Q${index}: ${data.problem_description}`}
			<span>
			{/* renderProblemStatus() */}
			</span>
			<div>
			{/* data.description_image.split(':').map((image,index)=>{
				return <img key={index} height={200} src={`${config.qiniu}/${image}`} />
			})*/}
			{ renderProblemImage() }
			</div>
			</div>
			<Form.Item>
			<Input type='textarea' rows={5} disabled={status}
			{...getFieldProps(`test-${data.id}`,{
				onChange: onFormChange,
				rules: [
					{ required: true, message: '该题未填写答案' },
				],
			})}
			/>
			</Form.Item>
			{renderRightAnswer()}
		</div>
	);
};

SubjectivityTest.propTypes = {  
	
};

export default SubjectivityTest;