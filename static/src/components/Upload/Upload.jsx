import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Icon } from 'antd';

import classNames from 'classnames';
import config from '../../config/config';

import styles from './Upload.less';

const Upload = ({ type }) => {
	// type 为 video,text,test
	const renderTitle = () =>{
		switch(type){
			case '0': return '创建课程'
			case '1': return '上传资料'
			case '2': return '创建测试'
		}
	}
	return (
		<div className={styles.block}>
			<Icon type="plus" />
			<div className={styles.title}>{renderTitle()}</div>
		</div>
	);
};

Upload.propTypes = {  
	
};

export default Upload;