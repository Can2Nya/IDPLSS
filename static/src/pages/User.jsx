import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon, Tabs } from 'antd';
import Layout from '../layouts/Layout/Layout';

import Title from '../components/Title/Title';
import Menu from '../components/Menu/Menu';
import UserBanner from '../components/UserBanner/UserBanner';
import DetailPannel from '../components/DetailPannel/DetailPannel';


import VideoCover from '../components/Widget/VideoCover/VideoCover';
import TestCover from '../components/Widget/TestCover/TestCover';
import TextCover from '../components/Widget/TextCover/TextCover';

import styles from './commont.less';

const User = ({ location }) => {
	const userMenu = {
		'1': '#!/dynamic/',
		'2': '#!/histroy/',
		'3': '#!/post/',
		'4': '#!/favorite/',
		'5': '#!/upload/',
		'6': '#!/setting/',
	}
	const handleTabsLink = ({...e}) =>{
		/*e为点击事件，包含tabs的key(然而键并不是key：xxx)
		console.log(e[0])*/
		return window.location.hash = userMenu[e[0]];
	}
	const handleActiveTab = () =>{
		for(var index in userMenu){
			if(userMenu[index] == location.hash) return index;
		}
	}

	return (
		<Layout location={location}>
		<div className={styles.user}>
			<div className={styles.userbg}>
				<div className={styles.contain} style={{padding:'0 10%',position:'relative',top:'-50px'}}>
				<UserBanner />
				</div>
			</div>
			<div className={styles.contain+' '+styles.tabpannel}>
			<div className={styles.position}>
			<Tabs onTabClick={handleTabsLink.bind(this)} activeKey={handleActiveTab()}>
				<Tabs.TabPane tab='动态' key='1'>

				</Tabs.TabPane>
				<Tabs.TabPane tab='历史' key='2'>

				</Tabs.TabPane>
				<Tabs.TabPane tab='帖子' key='3'>

				</Tabs.TabPane>
				<Tabs.TabPane tab='收藏' key='4'>

				</Tabs.TabPane>
				<Tabs.TabPane tab='设置' key='6'>

				</Tabs.TabPane>
			</Tabs>
			</div>
			</div>
		</div>
		</Layout>
	);
};

User.PropTypes = {

};

export default User;