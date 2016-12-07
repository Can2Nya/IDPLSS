import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link, Menu } from 'react-router';
import { Row, Col } from 'antd';

import BarChart from '../../components/Chart/BarChart/BarChart';
import CloudChart from '../../components/Chart/CloudChart/CloudChart';
import RadarChart from '../../components/Chart/RadarChart/RadarChart';
import TimeLine from '../../components/TimeLine/TimeLine';
import config from '../../config/config.js';
import styles from './Pannel.less';

const DynamicPannel = ({ children, data, activeKey }) => {
	const renderBarChart = () =>{
		if(data.barData && data.barData.length > 0){
			return <BarChart data={data.barData}/>
		}
	}
	const renderRadarChart = () =>{
		if(data.radarData && data.radarData.length > 0){
			return <RadarChart data={data.radarData}/>
		}
	}
	const renderCloudChart = () =>{
		if(data.cloudData && data.cloudData.length > 0){
			return <CloudChart data={data.cloudData}/>
		}
	}
	const renderChart = () =>{
		if(activeKey == '0') return renderBarChart();
		if(activeKey == '1') return renderRadarChart();
		if(activeKey == '2') return renderCloudChart();
	}
  	return (
	<div className={styles.dynamicpannel}>
	  <Row>
		
		<Col span={7} style={{ borderRight: '1px solid #e9e9e9'}}>
			<div className={styles.userinfo}>
				<div className={styles.row}>
					<span className={styles.big}>
					关注
					<span>{ data.user.user_followings }</span>
					</span>
					<span className={styles.big}>
					粉丝
					<span>{ data.user.user_followers }</span>
					</span>
				</div>
				<div className={styles.row}>
					<span className={styles.small}>
					uid
					<span>{ data.user.user_id }</span>
					</span>
				</div>
				<div className={styles.row}>
					<span className={styles.small}>
					邮箱
					<span>{ data.user.user_email }</span>
					</span>
				</div>
				<div className={styles.row}>
					<span className={styles.small}>
					注册时间
					<span>{ data.user.user_member_since }</span>
					</span>
				</div>
				<div className={styles.row}>
					<span className={styles.small}>
					最后一次登录
					<span>{ data.user.user_last_seen }</span>
					</span>
				</div>
			</div>
			{ children }
			
		</Col>
		<Col span={17}>
			{ renderChart() }
			
		</Col>
	  </Row>
	</div>
  );
};

DynamicPannel.propTypes = {
  //children: PropTypes.element.isRequired,
};


export default DynamicPannel;
