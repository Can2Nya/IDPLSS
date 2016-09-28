import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Tabs } from 'antd';

import TimeLine from '../../components/TimeLine/TimeLine';
import config from '../../config/config.js';
import styles from './Pannel.less';

const TabPannel = ({ children, data, title }) => {
	data = { ...data }
	return (
	<div className={styles.tabpannel}>
		<div className={styles.title}>
		{ title }
		</div>
		<Tabs>
		{ data.nav.map((tab,index) =><Tabs.TabPane key={ index } tab={ tab }>
			</Tabs.TabPane>
			) }
		</Tabs>
	</div>
	);
};

TabPannel.propTypes = {
	//children: PropTypes.element.isRequired,
};


export default TabPannel;
