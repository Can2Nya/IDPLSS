import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';

import { data } from '../services/user.js';//向user传送的数据

import { Steps, Row, Col, Radio, Input, Form, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';

import Layout from '../layouts/Layout/Layout';
import CommentContext from '../layouts/CommentContext/CommentContext';

import Button from '../components/Button/Button';

import styles from './commont.less';

let Register = ({ dispatch, location, form, user }) => {

	const { stepState, isAllowStepChange, registerFormisSubmit } = user;
	const { getFieldProps, validateFields, getFieldValue } = form;
	// -----------------action----------------------
	const handleStepUp = () =>{
		if(isAllowStepChange){
		dispatch({
			type:'user/register/stepState',
			stepState: stepState+1,
		})
		}
	}
	const handleStepDown = () =>{
		dispatch({
			type:'user/register/stepState',
			stepState: stepState-1,
		})
	}
	const handleIsAllowStepChange = (event) =>{
		let value;
		if(event.target.value) value = event.target.value;
		else value = event;
		dispatch({
			type:'user/register/allowStepChange',
			isAllowStepChange: value,
		})
		
	}
	const handleRrgister = (event) =>{
		event.preventDefault();
		validateFields((errors, values) =>{
			if(errors){
				return ;
			}
			data['body'] = form.getFieldsValue(['user_name','user_email','user_password']);//传输表单信息

			dispatch({
				type:'user/register',
			})
		});
	}
	// ==========================end===========================
	// -------------------------formrule-----------------------
	const formItemLayout = {
	   labelCol: { span: 4 },
	   wrapperCol: { span: 14 },
	};

	const nameProps = getFieldProps('user_name', {
		rules: [
			{ required: true, min: 2, max: 15, message: ['用户名至少为 2 个字符','用户名最多为 15 个字符'] },
			//{ validator: this.userExists },
		],
	});

	const emailProps = getFieldProps('user_email', {
		validate: [{
			rules: [{
				required: true,
			}],
			trigger: 'onBlur',
			},{
			rules: [{
				type: 'email', 
				message: '请输入正确的邮箱地址',
			}],
			trigger: ['onBlur', 'onChange'],
		}],
	});

	const passwdProps = getFieldProps('user_password', {
		rules: [{ 
			required: true, 
			whitespace: true, 
			message: '请填写密码' 
		},{ 
			validator: function(rule, value, callback){
				if(value){
					validateFields(['rePassword'], { force: true });
				}
				callback();
			},
		}],
	});

	const rePasswdProps = getFieldProps('rePassword', {
			rules: [{
				required: true,
				whitespace: true,
				message: '请再次输入密码',
			 }, {
				validator: function(rule, value, callback){
					if(value && value !== getFieldValue('user_password') ){
						callback('两次输入的密码不一致')
					}
					else callback();
				},
			  }],
			});
	// ---------------------end------------------------------
	// ======================render==========================
	const renderConfirmResult = () =>{
		if(user.success){
			return(
				<Col span={9}>
						<Icon type="check-circle-o" className={styles.rightmsg} />
						<div className={styles.msg}>账号验证成功</div>
				</Col>
				)
		}
		if(user.err){
			return(
				<Col span={9}>
						<Icon type="cross-circle-o" className={styles.rightmsg} />
						<div className={styles.msg}>非法操作</div>
				</Col>
				)
		}
	}

	const renderSteps = (step) =>{
		switch(step){
			case 0: return(

				<li key='1'>
				<div style={{position: 'absolute',width: '100%'}}>
				<Row type='flex' align='middle'>
					<Col span={20}>
						<div style={{height:'400px',width:'80%',overflowY: 'auto',fontSize: '20px',wordWrap: 'break-word'}}>
							llklklksdlklskdlaksldkalskdlkasldkalskdlaskldkalkdlaskldaklsdkalskdlaskldkasldklaksldkalskdlkslakdl
						</div>
					</Col>
					<Col span={4}>
					<Radio.Group onChange={handleIsAllowStepChange.bind(this)} defaultValue='false' className={styles.float} style={{display:'block'}}>
						<Radio key='1' value={false} style={{ display: 'block',height: '30px',lineHeight: '30px',}}>咱不同意</Radio>
						<Radio key='2' value={true} style={{ display: 'block',height: '30px',lineHeight: '30px',}}>咱同意</Radio>
					</Radio.Group>
					<Button type='ghost' onClick={handleStepUp.bind(this)} >
					下一步
					</Button>
					</Col>
				</Row>
				</div>
				</li>
				
				)
			case 1: 
			
			return(
				<li key='2'>
				<div style={{position: 'absolute',width: '100%'}}>
				<Form>
				<Row type='flex' align='middle'>
					<Col span={20}>
						<Form.Item
						{...formItemLayout}
						label='用户名'
						hasFeedback
						>
						<Input type='text' {...nameProps} />
						</Form.Item>

						<Form.Item
						{...formItemLayout}
						label='邮箱'
						hasFeedback
						>
						<Input type='text' {...emailProps} />
						</Form.Item>

						<Form.Item
						{...formItemLayout}
						label='密码'
						hasFeedback
						>
						<Input type='password' {...passwdProps} />
						</Form.Item>

						<Form.Item
						{...formItemLayout}
						label='确认密码'
						hasFeedback
						>
						<Input type='password' {...rePasswdProps} />
						</Form.Item>

					</Col>
					<Col span={4}>
					<Button type='ghost' onClick={handleStepDown.bind(this)} >
					上一步
					</Button>
					<Form.Item>
					<Button type='ghost' onClick={handleRrgister.bind(this)} htmlType='submit' loading={registerFormisSubmit}>
					下一步
					
					</Button>
					</Form.Item>
					</Col>
				</Row>
				</Form>
				</div>
				</li>
				
				)
			case 2: return(
				
				<li key='3'>
				<div style={{position: 'absolute',width: '100%'}}>
				<Row type='flex' align="middle" justify="center">
					<Col span={9}>
						<div className={styles.mail}>&#xe60d;</div>
						<div className={styles.msg}>一封邮件已发送至您的邮箱<br />请点击邮箱中的链接进行验证</div>
					</Col>
				</Row>
				</div>
				</li>
				
				)
			case 3: return(
				 
				<li key='4'>
				<div style={{position: 'absolute',width: '100%'}}>
				<div onClick={handleStepDown.bind(this)}>上一页
				</div>
				<Row type='flex' align="middle" justify="center">
					{ renderConfirmResult() }
				</Row>
				</div>
				</li>
				
				)
		}
	}
	return (
		<Layout location={location}>
			<CommentContext title='注册'>
			<div className={styles.register}>
				<Steps current={stepState}>
					<Steps.Step title='用户许可协议' />
					<Steps.Step title='填写注册信息' />
					<Steps.Step title='邮箱验证' />
					<Steps.Step title='完成' />
				</Steps>
				<div className={styles.margin}>
				<QueueAnim 
				type={['right','left']} 
				ease={['easeOutQuart', 'easeInOutQuart']}
				component='ul'
				>
					{renderSteps(stepState)}
				</QueueAnim>
				</div>
			</div>
			</CommentContext>
		</Layout>
	);
};

Register.PropTypes = {

};

Register = Form.create()(Register);

function mapStateToProp({ user }){
	return{
		user: user,
	};
}

export default connect(mapStateToProp)(Register);