import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Spin } from 'antd';
import classNames from 'classnames';
import Layout from '../layouts/Layout/Layout';

import Title from '../components/Title/Title';
import VideoCover from '../components/Widget/VideoCover/VideoCover';
import TextCover from '../components/Widget/TextCover/TextCover';
import TestCover from '../components/Widget/TestCover/TestCover';

import styles from './commont.less';

const Index = ({ video, text, test, location }) => {

	// ---------------render--------------------
	const renderVideoList = () =>{
		const { recommend, loading } = video
		if(loading) return <div className={styles.divCenter}><Spin /></div>
		if(recommend.list <= 0) return;
		else{
			return recommend.list.map((data,index)=>{
				return <Col span={8} lg={6} key={index}>
				<VideoCover data={data}  type='big'/>
				</Col>
			})
		}
	}
	const renderTextList = () =>{
		const { recommend, loading } = text
		if(loading) return <div className={styles.divCenter}><Spin /></div>
		if(recommend.list <= 0) return;
		else{
			return recommend.list.map((data,index)=>{
				return <Col span={6} lg={5} key={index}>
				<TextCover wordtype={data.resource_type} data={data} type='big' />
				</Col>
			})
		}
	}
	const renderTestList = () =>{
		const { recommend, loading } = test
		if(loading) return <div className={styles.divCenter}><Spin /></div>
		if(recommend.list <= 0) return;
		else{
			return recommend.list.map((data,index)=>{
				return <Col span={24} key={index}>
				<TestCover data={data} type='big' />
				</Col>
			})
		}
	}

	return (
		<Layout location={location}>
		<div className={styles.contain}>
			<div className={styles.marginCenter}>
			<Title type='big'  title='推荐课程' />
			</div>
			<div className={styles.margin}>
			<Row gutter={16} type="flex" align="middle">
			{ renderVideoList() }
			</Row>
			</div>
			<div className={styles.marginCenter}>
			<Title type='big'  title='推荐文档' />
			</div>
			<div className={styles.margin}>
			<Row gutter={16} type="flex" align="middle">
			{ renderTextList() }
			</Row>
			</div>
			<div className={styles.marginCenter}>
			<Title type='big'  title='真题测试' />
			</div>
			<div className={styles.margin}>
			<Row gutter={16} type="flex" align="middle">
			{ renderTestList() }
			</Row>
			</div>
		</div>
		</Layout>
	);
};

Index.PropTypes = {

};

function mapStateToProp({ video, text, test }){
	return{
		video: video,
		text: text,
		test: test
	};
}

export default connect(mapStateToProp)(Index);