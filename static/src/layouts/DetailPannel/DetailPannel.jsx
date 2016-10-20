import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Tabs } from 'antd';
import classNames from 'classnames';

import InputForm from '../../components/InputForm/InputForm';
import Comment from '../../components/Comment/Comment';


import styles from './DetailPannel.less';

const DetailPannel = ({ children, data }) => {
	return (
		<div className={styles.pannel}>
		<div className={styles.title} >简介
		</div>
		<div className={styles.text}>
		<p>{ data["description"] || data['test_description']}</p>
		</div>
		{ children }
		
		</div>
	);
};

DetailPannel.propTypes = {  
	
};

export default DetailPannel;