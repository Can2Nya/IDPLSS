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
				return <VideoCover data={data} key={index} />
			})
		}
	}
	const renderTextList = () =>{
		const { recommend, loading } = text
		if(loading) return <div className={styles.divCenter}><Spin /></div>
		if(recommend.list <= 0) return;
		else{
			return recommend.list.map((data,index)=>{
				return <TextCover data={data} type='big' key={index} />
			})
		}
	}
	const renderTestList = () =>{
		const { recommend, loading } = text
		if(loading) return <div className={styles.divCenter}><Spin /></div>
		if(recommend.list <= 0) return;
		else{
			return recommend.list.map((data,index)=>{
				return <TestCover data={data} type='big' key={index} />
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
			{ renderVideoList() }
			</div>
			<div className={styles.marginCenter}>
			<Title type='big'  title='推荐文档' />
			</div>
			<div className={styles.margin}>
			{ renderTextList() }
			</div>
			<div className={styles.marginCenter}>
			<Title type='big'  title='真题测试' />
			</div>
			<div className={styles.margin}>
			{ renderTestList() }
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