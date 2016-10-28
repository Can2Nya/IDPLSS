import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Pagination, Spin, Row, Col, Tabs } from 'antd';

// import TimeLine from '../../components/TimeLine/TimeLine';
// import List from '../../components/List/List';
// import Comment from '../../components/Comment/Comment';
// import VideoCover from '../../components/Widget/VideoCover/VideoCover';
// import TestCover from '../../components/Widget/TestCover/TestCover';
// import TextCover from '../../components/Widget/TextCover/TextCover';
// import PostCover from '../../components/Widget/PostCover/PostCover';

import config from '../../config/config.js';
import styles from './Pannel.less';

const TabPannel = ({ children, config, title, list, activeKey, onTabClick }) => {
	
	
	config = { ...config }
	return (
	<div className={styles.tabpannel}>
		<div className={styles.title}>
		{ title }
		</div>
		<Tabs activeKey={activeKey} onTabClick={onTabClick}>
		{ config.nav.map((tab,index) =><Tabs.TabPane key={ index } tab={ tab }>
			<div style={{minHeight: '500px'}}>
			
			{ children }

			</div>
			</Tabs.TabPane>
		)}
		</Tabs>
	</div>
	);
};

TabPannel.propTypes = {
	//children: PropTypes.element.isRequired,
};


export default TabPannel;
