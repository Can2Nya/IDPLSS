import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Radio, Icon } from 'antd';
import classNames from 'classnames';

import styles from './SelectTest.less';

const SelectTest = ({ status, data, onChange, value }) => {
	const renderProblemStatus = () =>{
		if(status !== undefined){
			return status ? (
				<Icon type="check-circle" />
			):(
				<Icon type="cross-circle" />
			)
		}
	}
	return (
		<div className={styles.selectTest}>
			<div className={styles.title}>
			Q1: xxxxxxxxxxwendiwenti
			<span>
			{ renderProblemStatus() }
			</span>
			</div>
			<Radio.Group onChange={onChange} value={value}>
			<Row gutter={24}>
			
			<Col span={12}>
				<Radio key='1' value='xxxxxx1'>xxxxxx1</Radio>
			</Col>
			<Col span={12}>
				<Radio key='2' value='xxxxxx2'>xxxxxx1</Radio>
			</Col>
			<Col span={12}>
				<Radio key='3' value='xxxxxx3'>xxxxxx1</Radio>
			</Col>
			<Col span={12}>
				<Radio key='4' value='xxxxxx4'>xxxxxx1</Radio>
			</Col>
			
			</Row>
			</Radio.Group>
		</div>
	);
};

SelectTest.propTypes = {  
	
};

export default SelectTest;