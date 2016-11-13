import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Input, Form, Icon, Collapse } from 'antd';
import classNames from 'classnames';

import styles from './SubjectivityTest.less';
import config from '../../../config/config.js'

const SubjectivityTest = ({ status, data, index, form, onFormChange }) => {

	const { getFieldProps, validateFields, getFieldValue } = form;

	const renderRightAnswer = () =>{
		if(status){
			return <Collapse>
					<Collapse.Panel header={`正确答案：${data.right_answer}`} key="1">
					<p>{data.problem_description}</p>
					</Collapse.Panel>
					</Collapse>
		}
	}

	const renderProblemStatus = () =>{
		if(status){	
			return getFieldValue(`test-${data.id}`) === data.right_answer ? (
				<Icon type="check-circle" />
			):(
				<Icon type="cross-circle" />
			)
		}
	}
	return (
		<div className={styles.subjectivityTest}>
			<div className={styles.title}>
			{`Q${index}: ${data.problem_description}`}
			<span>
			{ renderProblemStatus() }
			</span>
			{ data.description_image.split(':').map((image,index)=>{
				return <div key={index}><img height={200} src={`${config.qiniu}/${image}`} /></div>
			})}
			</div>
			<Form.Item>
			<Input type='textarea' rows={5} onChange={onFormChange}
			{...getFieldProps(`test-${data.id}`,{
				onChange: onFormChange
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