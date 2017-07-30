import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Spin, Pagination, Tabs } from 'antd';
import classNames from 'classnames';
import Layout from '../layouts/Layout/Layout';

import CommentContext from '../layouts/CommentContext/CommentContext';
import Title from '../components/Title/Title';
import VideoCover from '../components/Widget/VideoCover/VideoCover';
import TextCover from '../components/Widget/TextCover/TextCover';
import TestCover from '../components/Widget/TestCover/TestCover';
import PostCover from '../components/Widget/PostCover/PostCover';

import styles from './commont.less';

const Search = ({ user, dispatch, location }) => {
	const { isSelectMenuItem, searchList, keyWord, total, loading } = user

	// ---------------action--------------------
	const handChangeMenuItem = (key) =>{
		dispatch({
			type: 'user/changeMenuItem',
			isSelectMenuItem: key
		})
		const cata = ['video','text','test','post']
		browserHistory.push(`/search/#!/${cata[key]}/${keyWord}/1/`)
	}
	const handleChangePagination = (page) =>{
		const cata = ['video','text','test','post']
		browserHistory.push(`/search/#!/${cata[isSelectMenuItem]}/${keyWord}/${page}/`)
	}

	// ---------------render--------------------
	const renderVideoList = () =>{
		if(searchList.length <= 0) return <div>空空而也~</div>;
		else{
			return searchList.map((data,index)=>{
				if (!data.show) return;
				return <Col span={8} lg={6} key={index}>
				<VideoCover data={data}  type='big'/>
				</Col>
			})
		}
	}
	const renderTextList = () =>{
		if(searchList.length <= 0) return <div>空空而也~</div>;
		else{
			return searchList.map((data,index)=>{
				if (!data.show) return;
				return <Col span={6} lg={5} key={index}>
				<TextCover wordtype={data.resource_type} data={data} type='big' />
				</Col>
			})
		}
	}
	const renderTestList = () =>{
		if(searchList.length <= 0) return <div>空空而也~</div>;
		else{
			return searchList.map((data,index)=>{
				if (!data.show) return;
				return <Col span={24} key={index}>
				<TestCover data={data} type='big' />
				</Col>
			})
		}
	}
	const renderPostList = () =>{
		if(searchList.length <= 0) return <div>空空而也~</div>;
		else{
			return searchList.map((data,index)=>{
				if (!data.show) return;
				return <Col span={24} key={index}> 
				<PostCover commenttype='game' type='big' data={data}/>
				</Col>
			})
		}
	}
	return (
		<Layout location={location}>
		<CommentContext title='搜索'>
		<div className={styles.search}>
			<div>关键词：{keyWord}</div>
			<Tabs activeKey={isSelectMenuItem} onChange={handChangeMenuItem.bind(this)}>
				<Tabs.TabPane tab="课程" key='0'>
				<Spin spinning={loading}>
				<div style={{minHeight: '500px'}}>
				<Row>
				{ renderVideoList() }
				</Row>
				</div>
				<Pagination 
			onChange={handleChangePagination.bind(this)} 
			total={total}
			pageSize={12} 
			defaultPageSize={12} 
			/>
				</Spin>
				</Tabs.TabPane>
				<Tabs.TabPane tab="文库" key='1'>
				<Spin spinning={loading}>
				<div style={{minHeight: '500px'}}>
				<Row>
				{ renderTextList() }
				</Row>
				</div>
			<Pagination 
			onChange={handleChangePagination.bind(this)} 
			total={total}
			pageSize={12} 
			defaultPageSize={12} 
			/>
				</Spin>
				</Tabs.TabPane>
				<Tabs.TabPane tab="测试" key='2'>
				<Spin spinning={loading}>
				<div style={{minHeight: '500px'}}>
				<Row>
				{ renderTestList() }
				</Row>
				</div>
				<Pagination 
			onChange={handleChangePagination.bind(this)} 
			total={total}
			pageSize={12} 
			defaultPageSize={12} 
			/>
				</Spin>
				</Tabs.TabPane>
				<Tabs.TabPane tab="帖子" key='3'>
				<Spin spinning={loading}>
				<div style={{minHeight: '500px'}}>
				<Row>
				{ renderPostList() }
				</Row>
				</div>
				<Pagination 
			onChange={handleChangePagination.bind(this)} 
			total={total}
			pageSize={12} 
			defaultPageSize={12} 
			/>
				</Spin>
				</Tabs.TabPane>
			</Tabs>
		</div>
		</CommentContext>
		</Layout>
	);
};

Search.PropTypes = {

};

function mapStateToProp({user}){
	return{
		user: user,
	};
}

export default connect(mapStateToProp)(Search);