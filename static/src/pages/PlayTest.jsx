import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Progress, Affix, Form, Radio, Modal } from 'antd';
import classNames from 'classnames';
import QueueAnim from 'rc-queue-anim';//动画效果

import Button from '../components/Button/Button';
import Layout from '../layouts/Layout/Layout';
import ContextTitle from '../components/ContextTitle/ContextTitle';
import UserLittleInfo from '../components/UserLittleInfo/UserLittleInfo';
import SelectTest from '../components/widget/SelectTest/SelectTest';
import SubjectivityTest from '../components/widget/SubjectivityTest/SubjectivityTest';

import styles from './commont.less';

// import { data } from '../services/test.js';//向test传送的数据

let PlayTest = ({ test, user, form, dispatch, location }) =>{
	const { loginUserList } = user
	const { getFieldProps, getFieldsValue, validateFields, getFieldValue } = form;
	const { isSelectContext, isSelectPagination } = test
	const { result, submitCount, testRecordId, isSubmit, isComplete, isRolling, accuracy } = isSelectContext.isSelectContext
	// ---------------------fuc----------------------
	const isAllowTest = () =>{
		if(isSelectContext.list.length <= 0){
			browserHistory.push(`/detail/test/${isSelectContext.id}/#!/series/1/`)
		}
	}
	// --------------------action--------------------

	const handleRolling = (affixed) =>{
		dispatch({
			type: 'test/changeRoll',
			isRolling: affixed
		})
		
	}
	const handleCountProblem = () =>{
		// if(problemId == 15){
		// 	if(isSelectContext.next !== null){
		// 		dispatch({
		// 			type: 'test/changePagination',
		// 			isSelectPagination: isSelectPagination +1,
		// 		})
		// 		dispatch({
		// 			type: 'test/get/series',
		// 		})
		// 		dispatch({
		// 			type: "test/changeProblem",
		// 			problemId: 0
		// 		})
		// 	}
		// }
		let complete = 0;
		validateFields((errors, values)=>{
			isSelectContext.list.map((problem)=>{
				if(values[`test-${problem.id}`]) ++complete;
			})
		})
		dispatch({
			type: "test/countProblem",
			isComplete: complete,
		})
	}
	const handleSubmitProblem = () =>{
		let rez = getFieldsValue()
		isSelectContext.list.map((problem,index)=>{
			dispatch({
				type: "test/post/problemResult",
				id: problem.id,
				test_record_id: testRecordId,
				index: index+1,
				total: isSelectContext.total,
				body: { 
					user_answer: rez[`test-${problem.id}`], 
					problem_type: problem.problem_type, 
					answerer_id: loginUserList.user_id, 
					test_record_id: testRecordId,
					test_id: isSelectContext.id
				}
			})
		})
		// console.log(submitCount)
		// if(submitCount == isSelectContext.total){
			// dispatch({
			// 	type: 'test/get/problemResult',
			// 	id: testRecordId,
			// })
		// }
	}
	// --------------------render--------------------
	const renderProblem = () =>{
		// // const data = isSelectContext.list[id];
		// if(isSelectContext.total == isComplete){
		// 	{
		// 		return (
		// 			<div>你已完成测试</div>
		// 		)
		// 	}
		// }
		// return status? (
		// 	<div key={`${problemId}`} className={styles.position}>
		// 	<SelectTest status={isCorrect} data={isSelectContext.list[problemId]} index={problemId} value={answer} onAnswerChange={handleAnswerChange.bind(this)}/>
		// 	</div>
		// ):(
		// 	<div key={`${problemId}`} className={styles.position}>
		// 	<SelectTest data={isSelectContext.list[problemId]} index={problemId} value={answer} onAnswerChange={handleAnswerChange.bind(this)}/>
		// 	</div>
		// )
		return isSelectContext.list.map((problem,index)=>{
			if(!problem.show) return;
			if(problem.problem_type == 0){
				return (
					<SelectTest 
					key={index}
					form={form}
					status={isSubmit} 
					data={problem} 
					index={index} 
					result={result}
					onFormChange={handleCountProblem.bind(this)}
					>
					</SelectTest>
				)
			}else{
				return <SubjectivityTest 
				key={index}
				form={form}
				status={isSubmit} 
				data={problem} 
				index={index} 
				result={result}
				onFormChange={handleCountProblem.bind(this)}
				>
				</SubjectivityTest>
			}
		})
	}
	// const renderButtoon = () =>{
	// 	if(isSelectContext.total == isComplete){
	// 		return;
	// 	}
	// 	return status ? (
	// 			<Button type="ghost" onClick={handleProblemNext.bind(this)}>下一题</Button>
	// 		):(
	// 			<Button type="ghost" loading={isSubmit} onClick={handleSubmitProblem.bind(this)} >提交题目</Button>
	// 		)
	// }
	const renderPrecent = (value) =>{
		if(value == 0) return value;
		else{
			return (value*1.0/isSelectContext.total) * 100
		}
	}
	const renderProgressCls = classNames({
			[styles.progressBg]: isRolling,
			[styles.progressBlock]: true
		})
	const renderAccuracy = () =>{
		if(accuracy !== null){
			const modal = Modal.success({
				title: '您的答题正确率',
				content: <Progress type="circle" percent={renderPrecent(accuracy)} />
			});
		}
	}
	// ------------------end-------------------------
	return (
		<Layout location={location}>
		{ isAllowTest() }
		<div className={styles.playTest}>

		<div className={styles.contain}>
		<div className={styles.margin}>

		<Row type='flex' align='top'>
		<Col span={18}>
			<ContextTitle location={location} data={test}/>
		</Col>
		</Row>
		</div>

		
		<Affix offsetTop={60} onChange={handleRolling.bind(this)} >
		<div className={renderProgressCls}>
		<Row>
		<Col span={2}>
		<span style={{textAlign: 'center'}}>
		做题进度
		</span>
		</Col>
		<Col span={22}>
		<Progress percent={renderPrecent(isComplete)} strokeWidth={20} status="active" format={() => `${isComplete}/${isSelectContext.total}`} />
		</Col>
		</Row>
		</div>
		</Affix>
		

		</div>
		<div className={styles.testBlock}>
		<div className={styles.contain}>
		<div className={styles.testBg}>
			{/*<QueueAnim 
				type={['right','left']} 
				ease={['easeOutQuart', 'easeInOutQuart']}
				component='ul'
				>
				
			</QueueAnim>*/}

			<Form>
			{ renderProblem() }
			<Button type="ghost" disabled={isSubmit} onClick={handleSubmitProblem.bind(this)} >提交题目</Button>
			</Form>
		</div>
		</div>
		</div>

		</div>
		</Layout>
	);
}

PlayTest.PropTypes = {

};

PlayTest = Form.create()(PlayTest);

function mapStateToProp({ test, user }){
	// const { loginUserList } = user
	// if(loginUserList.length <= 0){
	// 	browserHistory.push('/login/')
	// }
	return{
		test: test,
		user: user
	}
}

export default connect(mapStateToProp)(PlayTest);