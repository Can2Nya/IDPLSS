import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';

import BarChart from '../../components/Chart/BarChart/BarChart';
import PieChart from '../../components/Chart/PieChart/PieChart';
import TimeLine from '../../components/TimeLine/TimeLine';
import config from '../../config/config.js';
import styles from './Pannel.less';

const DynamicPannel = ({ children, data }) => {
	console.log(data)
	const renderBarChart = () =>{
		if(data.barData && data.barData.length > 0){
			return <BarChart data={data.barData}/>
		}
	}
	const renderPieChart = () =>{
		if(data.pieData && data.pieData.length > 0){
			return <PieChart data={[
        {catagory: 0, value: 56.33 },
        {catagory: 1, value: 24.03},
        {catagory: 2, value: 10.38},
        {catagory: 3,  value: 4.77},
        {catagory: 4, value: 0.91},
        {catagory: 5, value: 0.2}
      ]}/>
		}
	}
  	return (
	<div className={styles.dynamicpannel}>
	  <Row>
		<Col span={17}>

			{ children }
			{/* renderBarChart() */}
			
		</Col>
		<Col span={7}>
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
		</Col>
	  </Row>
	  <Row>
	  {/* renderPieChart() */}
	  </Row>
	</div>
  );
};

DynamicPannel.propTypes = {
  //children: PropTypes.element.isRequired,
};


export default DynamicPannel;
