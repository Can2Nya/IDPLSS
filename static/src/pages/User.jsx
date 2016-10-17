import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Col, Icon, Tabs } from 'antd';
import cookie from 'js-cookie';

import Layout from '../layouts/Layout/Layout';
import DynamicPannel from '../layouts/UserPannel/DynamicPannel';
import TabPannel from '../layouts/UserPannel/TabPannel';
import SettingPannel from '../layouts/UserPannel/SettingPannel';

import Title from '../components/Title/Title';
import Menu from '../components/Menu/Menu';
import UserBanner from '../components/UserBanner/UserBanner';

import VideoCover from '../components/Widget/VideoCover/VideoCover';
import TestCover from '../components/Widget/TestCover/TestCover';
import TextCover from '../components/Widget/TextCover/TextCover';

import config from '../config/config';
import styles from './commont.less';

const User = ({ location, user }) => {
	const { userList } = user

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
				<UserBanner data={{ 'user':userList, 'config':config }}/>
				</div>
			</div>
			<div className={styles.contain+' '+styles.tabpannel}>
			<div className={styles.position}>
			<Tabs onTabClick={handleTabsLink.bind(this)} activeKey={handleActiveTab()}>
				<Tabs.TabPane tab='动态' key='1'>
					<DynamicPannel data={{ 'user': userList }} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='历史' key='2'>
					<TabPannel data={{'nav': ['视频','文本资料','测试']}} title='历史' />
				</Tabs.TabPane>
				<Tabs.TabPane tab='帖子' key='3'>
					<TabPannel data={{'nav': ['我创建的主题','我回复的','回复我的']}} title='帖子' />
				</Tabs.TabPane>
				<Tabs.TabPane tab='收藏' key='4'>
					<TabPannel data={{'nav': ['视频','文本资料','测试']}} title='历史' />
				</Tabs.TabPane>
				{ cookie.get('user_id') == userList.user_id ? (
					<Tabs.TabPane tab='设置' key='6'>
					<SettingPannel />
					</Tabs.TabPane>
				):[] }
			</Tabs>
			</div>
			</div>
		</div>
		</Layout>
	);
};

User.PropTypes = {

};

function mapStatetoPorp({ user }){
	return ({
		user: user,
	})
}

export default connect(mapStatetoPorp)(User);