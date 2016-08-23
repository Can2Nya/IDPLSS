import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Badge,Icon } from 'antd';

import styles from './Massage.less';

const Massage = () => {
	return (
				<Badge dot
							 className={styles.dot}
				>
					<a><span className={styles.massage}>&#xe60d;</span> </a>
				</Badge>
		);
}

Massage.propTypes = {  
	//text: PropTypes.element.isRequired,
	/*text: PropTypes.oneOfType([
	      React.PropTypes.string,
	      React.PropTypes.number,
  ]),*/
};

export default Massage;