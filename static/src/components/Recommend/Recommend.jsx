import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import classNames from 'classnames';

import VideoCover from '../Widget/VideoCover/VideoCover';
import TestCover from '../Widget/TestCover/TestCover';
import TextCover from '../Widget/TextCover/TextCover';

import Title from '../Title/Title';

import styles from './Recommend.less';

const Recommend = ({ user, type }) => {
	// type 推荐内容类型
	const { recommend } = user

	const renderContext = () =>{
		if(recommend.length <= 0) return <div>暂时没有推荐</div>;
		else{
			return recommend.map((data,index)=>{
				if(!data.show) return ;
				switch(type){
					case 'video':
					return (
					<div className={styles.margin} key={index}>
					<Col span={20}>
					<VideoCover data={data} type='big' />
					</Col>
					</div>);
					case 'text':
					return (
					<div className={styles.margin} key={index}>
					<Col span={20}>
					<TextCover data={data} type='small' wordtype={data.resource_type} />
					</Col>
					</div>)
					case 'test':
					return (
					<div className={styles.margin} key={index}>
					<Col span={20}>
					<TestCover data={data} type='small' />
					</Col>
					</div>)
				}
			})
		}
	}

	return (
		<div>
		<Title title='推荐内容' noline={true} type='small' />
		<Row>
		{ renderContext() }
		</Row>
		</div>
	);
};

Recommend.propTypes = {  
	
};

function mapStateToProp({ user }){
	return{
		user: user
	};
}

export default connect(mapStateToProp)(Recommend);
