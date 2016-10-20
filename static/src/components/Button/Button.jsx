import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Button as AntdButton } from 'antd';
import classNames from 'classnames';

import styles from './Button.less';

const Button = ({ children, type, loading, htmlType, icon, onClick }) => {
	/*type有primary,ghost,dashed*/
	const buttonCls = classNames({
		[styles[type]]: true,
	})
	return (
		<AntdButton type={type} 
		className={buttonCls} 
		onClick={onClick}
		loading={loading}
		htmlType={htmlType}
		icon={icon}
		>
		{children}
		</AntdButton>
		);
}

Button.propTypes = {  
	
};

export default Button;