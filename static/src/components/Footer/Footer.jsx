import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';

import styles from './Footer.less';

const Footer = ({ config }) => {
	return (
		<div className={styles.footer}>
			<div>
				<Row className={styles.row}>
					<Col span={6}>
						<img src={config.logomid} />
					</Col>
					<Col span={2} offset={10}>
					<a><span>关于我们</span></a>
					</Col>
					<Col span={2}>
					<a><span>联系我们</span></a>
					</Col>
					<Col span={2}>
					<a><span>帮助中心</span></a>
					</Col>
					<Col span={2}>
					<a><span>意见反馈</span></a>
					</Col>
				</Row>
					
				<Row className={styles.center}>
					<Col span={24}>
						<span>备案号：</span>
					</Col>
				</Row>
			</div>
		</div>
	);
}

Footer.propTypes = {  
	//text: PropTypes.element.isRequired,
	/*text: PropTypes.oneOfType([
	      React.PropTypes.string,
	      React.PropTypes.number,
  ]),*/
};

export default Footer;