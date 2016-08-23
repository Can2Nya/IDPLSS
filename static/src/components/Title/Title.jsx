import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';

import classNames from 'classnames';
import config from '../../config/config';

import styles from './Title.less';

const Title = ({ title, type }) => {
	const titleCls = () =>{
		if (type == 'small') {return styles.small}
		if (type == 'big') {return styles.big}
	};
	const renderTitle = () =>{
		if (type == 'big') {
			return(
				<div className={styles.right}>
				<img src={config.dot} />
				<Link to="#">
				<span>more</span>
				</Link>
				</div>
			);
		}
		return;
	};
	return (
		<div className={titleCls()}>
			<span className={styles.text}>{title}</span>
			{renderTitle()}
		</div>
	);
};

Title.propTypes = {  
	
};

export default Title;