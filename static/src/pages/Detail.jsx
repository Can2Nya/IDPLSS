import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon, Tabs } from 'antd';
import Layout from '../layouts/Layout/Layout';

import Title from '../components/Title/Title';
import Menu from '../components/Menu/Menu';
import List from '../components/List/List';
import Comment from '../components/Comment/Comment';
import InputForm from '../components/InputForm/InputForm';
import Preview from '../components/Preview/Preview';
import DetailPannel from '../components/DetailPannel/DetailPannel';


import VideoCover from '../components/Widget/VideoCover/VideoCover';
import TestCover from '../components/Widget/TestCover/TestCover';
import TextCover from '../components/Widget/TextCover/TextCover';

import styles from './commont.less';

const Detail = ({ location }) => {
	/*chidren为router*/
	const handleTabsLink = ({...e}) =>{
		/*e为点击事件，包含tabs的key(然而键并不是key：xxx)
		console.log(e[0])*/
		const hash = (key) =>{
			switch(key){
				case '1': return '#!/list/';
				case '2': return '#!/comment/';
			}
		}
		return window.location.hash = hash(e[0]);
	}
	const handleActiveTab = () =>{
		switch(location.hash){
			case '#!/list/': return '1';
			case '#!/comment/': return '2';
		}
	}
	return (
		<Layout location={location}>
			<div className={styles.contain}>
			<div className={styles.margin}>
			<Row>
			<div className={styles.margin}>
				<Breadcrumb>
							<Breadcrumb.Item>
							<Icon type="home" />
							</Breadcrumb.Item>
							<Breadcrumb.Item>
							全部课程
							</Breadcrumb.Item>
				
				</Breadcrumb>
			</div>
			<Col span={8} lg={7}>
			<Preview type='video' />
			</Col>

			<Col span={16} lg={17} >
			<div className={styles.detail}>
			<DetailPannel>
				<div className={styles.tabpannel}>
				<Tabs onTabClick={handleTabsLink.bind(this)} activeKey={handleActiveTab()}>
				<Tabs.TabPane tab='列表' key={1} >
					<List>
					11111111111
					</List>
				</Tabs.TabPane>
				<Tabs.TabPane tab='评论' key={2} >
					<InputForm />
					<Comment />
				</Tabs.TabPane>
				</Tabs>
				</div>
			</DetailPannel>
			</div>
			</Col>
			</Row>
			</div>
			</div>
		</Layout>
	);
};

Detail.PropTypes = {

};

export default Detail;