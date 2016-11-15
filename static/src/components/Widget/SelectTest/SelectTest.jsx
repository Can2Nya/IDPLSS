import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Radio, Icon, Form, Collapse } from 'antd';
import classNames from 'classnames';

import styles from './SelectTest.less';
import config from '../../../config/config.js'

const SelectTest = ({ status, data, index, form, onFormChange }) => {

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
		<div className={styles.selectTest}>
			<div className={styles.title}>
			{ `Q${index}: ${data.problem_description}`}
			<span>
			{ renderProblemStatus() }
			</span>
			{ data.description_image.split(':').map((image,index)=>{
				return <div key={index}><img height={200} src={`${config.qiniu}/${image}`} /></div>
			})}
			</div>
			<Form.Item>
				<Radio.Group
				{...getFieldProps(`test-${data.id}`,{
					onChange: onFormChange
				})}>
				
					<Radio key='1' value={ `${data.choice_a}` }>{ data.choice_a }</Radio>
				
					<Radio key='2' value={ `${data.choice_b}` }>{ data.choice_b }</Radio>
				
					<Radio key='3' value={ `${data.choice_c}` }>{ data.choice_c }</Radio>
				
					<Radio key='4' value={ `${data.choice_d}` }>{ data.choice_d }</Radio>
				
			</Radio.Group>
			</Form.Item>
			{renderRightAnswer()}
		</div>
	);
};

SelectTest.propTypes = {  
	
};

export default SelectTest;