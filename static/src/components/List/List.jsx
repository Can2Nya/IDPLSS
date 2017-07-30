import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Tabs } from 'antd';
import classNames from 'classnames';

import styles from './List.less';

const List = ({ children }) => {
	/*const ListCls = () =>{
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
		<div className={styles.pannel}>
		<div className={styles.text}>
			{ children }
		</div>
		</div>
	);
};
List.propTypes = {  
	
};

export default List;