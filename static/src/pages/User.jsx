import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Breadcrumb, Pagination, Spin, Row, Col, Icon, Tabs, Card, Progress } from 'antd';
import cookie from 'js-cookie';

import Layout from '../layouts/Layout/Layout';
import DynamicPannel from '../layouts/UserPannel/DynamicPannel';
import TabPannel from '../layouts/UserPannel/TabPannel';
import SettingPannel from '../layouts/UserPannel/SettingPannel';

import Title from '../components/Title/Title';
import Menu from '../components/Menu/Menu';
import UserBanner from '../components/UserBanner/UserBanner';
import Comment from '../components/Comment/Comment';
import InputForm from '../components/InputForm/InputForm';

import BarChart from '../components/Chart/BarChart/BarChart';
import RadarChart from '../components/Chart/RadarChart/RadarChart';
import VideoCover from '../components/Widget/VideoCover/VideoCover';
import TestCover from '../components/Widget/TestCover/TestCover';
import TextCover from '../components/Widget/TextCover/TextCover';
import PostCover from '../components/Widget/PostCover/PostCover';

import config from '../config/config';
import styles from './commont.less';

const User = ({ location, dispatch, user }) => {
	const { radarData, barData, userList, loginUserList, total, userZoneList, isSelectTab, isSelectSubTab, loading } = user

	const userMenu = {
		'0': '#!/dynamic',
		// '2': '#!/histroy',
		'1': '#!/post',
		'2': '#!/favorite',
		'3': '#!/comment',
		'4': '#!/upload',
		'5': '#!/setting',
	}
	// --------------------action-------------------------
	const handleTabsLink = ({...e}) =>{
		/*e为点击事件，包含tabs的key(然而键并不是key：xxx)
		console.log(e[0])*/
		dispatch({
			type: 'user/changeSelectTab',
			isSelectTab: e[0]
		})
		window.location.hash = `${userMenu[e[0]]}/0/`;
	}
	const handleSubTabsLink = ({...e}) =>{
		/*e为点击事件，包含tabs的key(然而键并不是key：xxx)
		console.log(e[0])*/
		dispatch({
			type: 'user/changeSelectSubTab',
			isSelectSubTab: e[0]
		})
		window.location.hash = `${userMenu[isSelectTab]}/${e[0]}/`;
	}
	const handlePostDelete = (commentid, authorid, e) =>{
		// if ((loginUserList.user_type == 2 && loginUserList.user_id == isSelectContext.context.author_id) || (user.loginUserList.user_type >= 3) || (user.loginUserList.user_id == authorid)){
			// 第二道防线
			let stateName;
			switch(isSelectSubTab){
				case '0': stateName = 'Video';
				case '1': stateName = 'Text';
			}
			dispatch({
				type: `${stateName}/delete/comment`,
				id: id,
				comment_id: commentid,
			})
		// }
	}
	const handleChangePagination = (page) =>{
		let action = 'user/get/user';
		if(isSelectTab == '1'){
			switch(isSelectSubTab){
				case '0': action += 'Post'; break;
				case '1': action += 'PostComment'; break;
			}
		}
		if(isSelectTab == '2'){
			switch(isSelectSubTab){
				case '0': action += 'VideoCollection'; break;
				case '1': action += 'TextCollection'; break;
				case '2': action += 'TestComplete'; break;
			}
		}
		if(isSelectTab == '3'){
			switch(isSelectSubTab){
				case '0': action += 'VideoCollection'; break;
				case '1': action += 'TextCollection'; break;
			}
		}
		if(isSelectTab == '4'){
			switch(isSelectSubTab){
				case '0': action += 'Video'; break;
				case '1': action += 'Text'; break;
				case '2': action += 'Test'; break;
			}
		}
		dispatch({
			type: action,
			isSelectPagination: page
		})
	}
	// ----------------render---------------------------
	// const renderActiveTab = () =>{
	// 	for(var index in userMenu){
	// 		if(userMenu[index] == location.hash) return index;
	// 	}
	// }
	const renderList = () =>{
		if(loading){
			return <Spin />;
		}
		if(userZoneList.length <= 0 || !userZoneList){
			return <div>暂时还未有内容</div>;
		}
		if(isSelectTab == '1'){

			switch(isSelectSubTab){
				case '0': 
				return userZoneList.map((data,index) =>{
					if(!data.show) return
					return (
						<Col span={24} key={index}> 
							<PostCover commenttype='game' type='big' data={data}/>
						</Col>
					)
				})
				case '1':
				return userZoneList.map((data,index) =>{
					if(!data.show) return
					return(
						<Col span={24} key={index}> 
						<Comment key={index} data={data} 
						user={{ 
						authorid: data.author_id, 
						loginid: loginUserList.user_id, 
						logintype: loginUserList.user_type
						}}  
						onDelete={handlePostDelete.bind(this)}/>
						</Col>
					);
				})
			}
		}
		if(isSelectTab == '3'){
			return userZoneList.map((data,index) =>{
				if(!data.show) return
				return(
					<Col span={24} key={index}> 
						<Comment key={index} data={data} user={{ 
						authorid: data.author_id, 
						loginid: loginUserList.user_id, 
						logintype: loginUserList.user_type}}  onDelete={handlePostDelete.bind(this)}/>
					</Col>
					);
				})
		}
		if(isSelectTab == '4' && isSelectSubTab == '2'){
			return userZoneList.map((data,index) =>{
				if(!data.show) return;
				return(
					<Col span={24} key={index}> 
						<TestCover type='big' data={data}/>
					</Col>
				)
			})
		}
		return userZoneList.map((data,index) =>{
			if(!data.show) return
			switch(isSelectSubTab){
				case '0': 
				if(!data.show) return
				return(
					<Col span={8} lg={6} key={index}> 
					<VideoCover data={data} type='small'/>
					</Col>
				);
				case '1':
				if(!data.show) return;
				return(
					<Col span={8} lg={6} key={index}> 
					<TextCover wordtype={data.resource_type} type='big' data={data}/>
					</Col>
				)
				case '2':
				if(!data.show) return;
				return(
					<Col span={8} lg={6} key={index}> 
					<Card 
					title={data.test_title} 
					bodyStyle={{ textAlign: 'center' }}
					extra={<Link to={{pathname:`/detail/test/${data.test_id}/`,hash:`#!/series/1/`}}>详情</Link>} 
					style={{ width: '100%' }}>
						<Progress type="circle" strokeWidth={9} percent={data.test_accuracy * 100} format={percent => `${data.test_accuracy * 100}%`}/>
						<p style={{ margin: '10px 0 15px 0'}}>正确率</p>
						<p>{`问题个数：${data.answers_count}`}</p>
						<p>{`测试完成情况：${data.is_finished ? '已完成' : '未完成'}`}</p>
					</Card>
					</Col>
				)
			}
		})
	}
	const renderBarChart = () =>{
		if(barData && barData.length > 0){
			return <BarChart data={barData}/>
		}
	}
	const renderRadarChart = () =>{
		if(radarData && radarData.length > 0){
			return <RadarChart data={radarData}/>
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
			<Tabs onTabClick={handleTabsLink.bind(this)} activeKey={isSelectTab}>
			{ cookie.get('user_id') == userList.user_id ? [
				<Tabs.TabPane tab='基本信息' key='0'>
					<DynamicPannel data={{ 'user': userList }} >
						<div>
						{ renderBarChart() }
						{ renderRadarChart() }
						</div>
					</DynamicPannel>
				</Tabs.TabPane>,
				/*<Tabs.TabPane tab='我参与的' key='2'>
					<TabPannel config={{'nav': ['课程','文本资料','测试']}} title='历史'  onTabClick={handleSubTabsLink.bind(this)} activeKey={isSelectSubTab}/>
				</Tabs.TabPane>,*/
				<Tabs.TabPane tab='帖子' key='1'>

					<TabPannel 
					
					config={{'nav': ['我创建的主题','我回复的']}} 
					title='帖子' 
					onTabClick={handleSubTabsLink.bind(this)} 
					activeKey={isSelectSubTab}
					>
					<Row gutter={16} type="flex" align="middle" >
					{ renderList() }
					</Row>
					<Pagination total={total} current={20} onChange={handleChangePagination.bind()} />
					</TabPannel>
					

				</Tabs.TabPane>,
				<Tabs.TabPane tab='我参与的' key='2'>
					<TabPannel 
					
					config={{'nav': ['课程','文本资料','测试']}} 
					title='我参与的' 
					onTabClick={handleSubTabsLink.bind(this)} 
					activeKey={isSelectSubTab}
					>
					<Row gutter={16} type="flex" align="middle" >
					{ renderList() }
					</Row>
					<Pagination total={total} current={20} onChange={handleChangePagination.bind()} />
					</TabPannel>

				</Tabs.TabPane>,
				<Tabs.TabPane tab='评论' key='3'>
					<TabPannel
					config={{'nav': ['课程','文本资料']}} 
					title='评论' 
					onTabClick={handleSubTabsLink.bind(this)} 
					activeKey={isSelectSubTab}
					>
					<Row gutter={16} type="flex" align="middle" >
					{ renderList() }
					</Row>
					<Pagination total={total} current={20} onChange={handleChangePagination.bind()} />
					</TabPannel>

				</Tabs.TabPane>,
					<Tabs.TabPane tab='我上传的' key='4'>
						<TabPannel 
						config={{'nav': ['课程','文本资料','测试']}} 
						title='我上传的资料' 
						onTabClick={handleSubTabsLink.bind(this)} 
						activeKey={isSelectSubTab}
						>

						<Row gutter={16} type="flex" align="middle" >
						{ renderList() }
						</Row>
						<Pagination total={total} current={20} onChange={handleChangePagination.bind()} />
					</TabPannel>

					</Tabs.TabPane>,
					<Tabs.TabPane tab='设置' key='5'>
						<SettingPannel />
					</Tabs.TabPane>
			]:(
				<Tabs.TabPane tab='基本信息' key='1'>
					<DynamicPannel data={{ 'user': userList }} />
				</Tabs.TabPane>
			)}
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