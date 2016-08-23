import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Popover } from 'antd';

import styles from './User.less';

const User = () => {
	return (
				<Popover 
								 placement="bottomRight"
				>
					<div className={styles.userImg}></div>
				</Popover>
		);
}

User.propTypes = {  
	//text: PropTypes.element.isRequired,
	/*text: PropTypes.oneOfType([
	      React.PropTypes.string,
	      React.PropTypes.number,
  ]),*/
};

export default User;