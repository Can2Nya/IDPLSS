import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import classNames from 'classnames';

import styles from './TextCover.less';

const TextCover = ({ wordtype, type, data }) => {
	const typeCls = () =>{
		/*大小*/
		return classNames({
			[styles[type]]:true,
		})
	}
	const coverCls = () =>{
		/*文件类型*/
		const word = ['other','word','excel','pdf']
		return classNames({
			[styles[word[wordtype]]]:true,
		})
	};
	const renderTextCover = (typeCls, coverCls) =>{
		if(type == 'big') return <div className={typeCls}>
			<div className={coverCls}>
			<div className={styles.title}>{ data.resource_name }
			</div>
			<div className={styles.position}>
			{/*<div className={styles.subtitle}>课程名称</div>*/}
			<div className={styles.subtitle}>{ data.name }</div>
			</div>
		</div>
		</div>;
		if(type == 'small') return <div className={typeCls}>
			<div className={coverCls}>
			<div className={styles.title}>{ data.resource_name }</div>
			</div>
			</div>;
	}
	return renderTextCover(typeCls(),coverCls());
};

TextCover.propTypes = {  
	
};

export default TextCover;