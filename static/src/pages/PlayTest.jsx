import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Progress } from 'antd';
import QueueAnim from 'rc-queue-anim';//动画效果

import Button from '../components/Button/Button';
import Layout from '../layouts/Layout/Layout';
import VideoTitle from '../components/VideoTitle/VideoTitle';
import UserLittleInfo from '../components/UserLittleInfo/UserLittleInfo';
import SelectTest from '../components/widget/SelectTest/SelectTest';

import styles from './commont.less';

import { data } from '../services/test.js';//向test传送的数据

const PlayTest = ({ test, dispatch, location }) =>{
	const { isSelectContext, isSelectPagination } = test
	const { id, problemId, testRecordId, isSubmit, isCorrect, isComplete, status } = isSelectContext.isSelectContext
	// --------------------action--------------------

	// const handleProblemInit = () =>{
	// 	dispatch({
	// 		type: "test/init/problem",
	// 	})
		
	// }
	const handleProblemNext = () =>{
		if(problemId == 15){
			if(isSelectContext.next !== null){
				dispatch({
					type: 'test/changePagination',
					isSelectPagination: isSelectPagination +1,
				})
				dispatch({
					type: 'test/get/series',
				})
				dispatch({
					type: "test/changeProblem",
					problemId: 0
				})
			}
		}
		dispatch({
			type: "test/changeProblem",
			problemId: problemId + 1,
		})
	}
	const handleSubmitProblem = (value) =>{
		if(value.target.value){
			data['body'] = {
				"user_answer": value.target.value,
				"problem_type": 0,
				"answerer_id": 1,
				"test_record_id": testRecordId,
				"test_id": isSelectContext.id
			}
		}
		
		dispatch({
			type: "test/post/problemResult",
		})
	}
	// --------------------render--------------------
	const renderProblem = () =>{
		// const data = isSelectContext.list[id];
		if(isSelectContext.total == isComplete){
			{
				return (
					<div>你已完成测试</div>
				)
			}
		}
		return status? (
			<div key={`${problemId}`} className={styles.position}>
			<SelectTest status={isCorrect}/>
			</div>
		):(
			<div key={`${problemId}`} className={styles.position}>
			<SelectTest />
			</div>
		)
	}
	const renderButtoon = () =>{
		if(isSelectContext.total == isComplete){
			return;
		}
		return status ? (
				<Button type="ghost" onClick={handleProblemNext.bind(this)}>下一题</Button>
			):(
				<Button type="ghost" loading={isSubmit} onClick={handleSubmitProblem.bind(this)} >提交题目</Button>
			)
	}
	const renderPrecent = () =>{
		if(isComplete == 0) return isComplete;
		else{
			return isComplete*1.0/isSelectContext.total
		}
	}
	// ------------------end-------------------------
	return (
		<Layout location={location}>
		<div className={styles.playTest}>

		<div className={styles.contain}>
		<div className={styles.margin}>

		<Row type='flex' align='top'>
		<Col span={18}>
			<VideoTitle location={location}/>
		</Col>
		</Row>
		</div>

		<div className={styles.margin}>
		<Row>
		<Col span={2} lg={1}>
		<span>
		做题进度
		</span>
		</Col>
		<Col span={22} lg={23}>
		<Progress percent={renderPrecent()} strokeWidth={20} status="active" format={() => `${isComplete}/${isSelectContext.total}`} />
		</Col>
		</Row>
		</div>

		</div>
		<div className={styles.testBlock}>
		<div className={styles.contain}>
		<div className={styles.testBg}>
			<QueueAnim 
				type={['right','left']} 
				ease={['easeOutQuart', 'easeInOutQuart']}
				component='ul'
				>
				{ renderProblem() }
			</QueueAnim>
			{ renderButtoon() }
		</div>
		</div>
		</div>

		</div>
		</Layout>
	);
}

PlayTest.PropTypes = {

};

function mapStateToProp({ test, user }){
	const { loginUserList } = user
	if(loginUserList.length <= 0){
		browserHistory.push('/login/')
	}
	return{
		test: test,
	}
}

export default connect(mapStateToProp)(PlayTest);