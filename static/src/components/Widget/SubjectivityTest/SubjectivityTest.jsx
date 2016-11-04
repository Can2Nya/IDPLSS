import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Input } from 'antd';
import classNames from 'classnames';

import styles from './SubjectivityTest.less';

const SubjectivityTest = ({ status, data, onChange, value }) => {
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
			<Input type='textarea' />
		</div>
	);
};

SubjectivityTest.propTypes = {  
	
};

export default SubjectivityTest;