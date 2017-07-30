import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';

import classNames from 'classnames';
import config from '../../config/config';

import styles from './Title.less';

const Title = ({ title, type, noline }) => {
	const titleCls = () =>{
		/*var style = {}
		if (noline) style[[styles.noline]] = true;
		if (type == 'small') style[[styles.small]] = true;
		if (type == 'big') style[[styles.big]] = true;*/
		

		return classNames({
			[styles.noline]:noline,
			[styles[type]]:true,
		});
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