import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import classNames from 'classnames';

import styles from './TextCover.less';

const TextCover = ({ wordtype, type }) => {
	const typeCls = () =>{
		/*大小*/
		return classNames({
			[styles[type]]:true,
		})
	}
	const coverCls = () =>{
		/*文件类型*/
		return classNames({
			[styles[wordtype]]:true,
		})
	};
	const renderTextCover = (typeCls, coverCls) =>{
		if(type == 'big') return <div className={typeCls}>
			<div className={coverCls}>
			<div className={styles.title}>这是标题
			</div>
			<div className={styles.position}>
			<div className={styles.subtitle}>课程名称</div>
			<div className={styles.subtitle}>教师名称</div>
			</div>
		</div>
		</div>;
		if(type == 'small') return <div className={typeCls}>
			<div className={coverCls}>
			<div className={styles.title}>标题</div>
			</div>
			</div>;
	}
	return renderTextCover(typeCls(),coverCls());
};

TextCover.propTypes = {  
	
};

export default TextCover;