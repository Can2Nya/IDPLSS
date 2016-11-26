import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Radio, Icon, Form, Collapse } from 'antd';
import classNames from 'classnames';

import styles from './SelectTest.less';
import config from '../../../config/config.js'

const SelectTest = ({ time, result, status, data, index, form, onFormChange }) => {

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
			return result.map(data =>{
				if (data.id == index){
					return data.status ? (
						<Icon type="check-circle" />
					):(
						<Icon type="cross-circle" />
					)
				}
			})
			
		}
	}
	const renderProblemImage = () =>{
		if(data.description_image == '') return;
		return data.description_image.split(':').map((image,index)=>{
			return <img key={index} height={200} src={`${config.qiniu}/${image}`} />
		})
	}
	return (
		<div className={styles.selectTest}>
			<div className={styles.title}>
			{ `Q${index}: ${data.problem_description}`}
			<span>
			{ renderProblemStatus() }
			</span>
			<div>
			{/* data.description_image.split(':').map((image,index)=>{
				return <img key={index} height={200} src={`${config.qiniu}/${image}`} />
			})*/}
			{ renderProblemImage() }
			</div>
			</div>
			<Form.Item>
				<Radio.Group
				{...getFieldProps(`test-${data.id}`,{
					onChange: onFormChange,
					rules: [
						{ required: true, message: '该题未填写答案' },
					],
				})}>
				
					<Radio key='1' value='a'>{ data.choice_a }</Radio>
				
					<Radio key='2' value='b'>{ data.choice_b }</Radio>
				
					<Radio key='3' value='c'>{ data.choice_c }</Radio>
				
					<Radio key='4' value='d'>{ data.choice_d }</Radio>
				
			</Radio.Group>
			</Form.Item>
			{renderRightAnswer()}
		</div>
	);
};

SelectTest.propTypes = {  
	
};

export default SelectTest;