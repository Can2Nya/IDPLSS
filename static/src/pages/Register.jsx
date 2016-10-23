import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';

import { data } from '../services/user.js';//向user传送的数据

import { Steps, Row, Col, Select, Radio, Checkbox, Input, Form, Icon } from 'antd';
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
			//将兴趣用：连起来
			let interested = ''
			getFieldValue('interested_field').map((value,index) => {
				if(index == getFieldValue('interested_field').length -1) interested += `${value}`
				else interested += `${value}:`
			})
			dispatch({
				type:'user/register',
				body: {
					user_name: getFieldValue('user_name'), 
					user_email: getFieldValue('user_email'),
					user_password: getFieldValue('user_password'), 
					sex: getFieldValue('sex'),
					subject: getFieldValue('subject'),
					interested_field: interested
				}
				// body: form.getFieldsValue(['user_name','user_email','user_password'])
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

	const sexProps = getFieldProps('sex', {
	  rules: [
		{ required: true, message: '请选择您的性别', type: 'number'},
	  ],
	});

	const selectProps = getFieldProps('subject', {
	  rules: [
		{ required: true, message: '请选择您的专业方向', type: 'number'},
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

	const multiSelectProps = getFieldProps('interested_field', {
      rules: [
        { required: true, message: '请选择您喜欢的兴趣', type: 'array' },
      ],
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
							<h3>免责声明</h3>
							<p>在您使用我们的提供各项服务前，请仔细阅读制定的规则并严格遵守，任何不符合要求的帖子、内容和评论等将会被删除或关闭处理，同时，本服务运维团队保留追究责任的权利。本服务认为，所有使用者在使用本服务及其它各层页面时已经仔细看过本条款，间接使用本服务资料者，视为自愿接受本网站声明的规定。</p>
							<p>1、本服务支持每一个公民在宪法的规定下行使公民言论自由的权利，本服务所有言论仅代表使用者个人观点。但并不表示我们支持这些言论所代表的观点，不保证发布帖子内容的真实性，不对使用者发表的言论承担任何法律责任。如果您发现有不当的言论或帖子，请及时邮件通知运维团队，运维团队会在第一时间做出审核和相应的处理。</p>
							<p>2、本服务的使用不得盗用未经作者授权的文字、图书、音像，软件作品等，转载他人作品请获得作者授权，尊重他人的合法权利。如果您在本服务发现有内容侵犯了您的权利，请及时联系运维团队，我们会及时作出处理，同时，具体责任由内容发布者承担。</p>
							<p>3、本服务内严禁一切灌水行为，包括发布水贴，发表无意义表情等行为。严禁发布一切色情、血腥、暴力的话题以及回复。禁止一切谩骂行为，相关内容一旦被发现，将不做通知立即删除相关内容，同时视情况给与删号处理。</p>
							<p>4、严禁发布一切与政治相关的话题，帖子以及回复，如有违反，将不给于警告立即删除相关内容。同时，本服务不对发布的内容承担任何责任。</p>
							<p>5、我们会竭力保障用户的信息安全，如因不可抗拒的因素导致用户信息丢失泄露，如服务器损坏宕机，本服务不承担任何责任。</p>
							<p>6、请各位加入到xxx的网友们，严格遵守以上规定，让xxx可以更加健壮的成长下去。</p>
							<p>7、对本服务有建议，请统一发送到意见反馈邮箱，我们也真诚的期待您的反馈意见。</p><p>备注：如发现本规定有不完善之处，可及时反馈邮件至运维团队进行修正。<br />规定包括但不限于上述内容，规定将会不定期的更新并置放于主页明显出处让使用者查看。
							<br />以上规定适用于本服务所有版块，自本规定颁布之日起正式实施。<br />xxx运维团队拥有最终解释权，法律上有相关解释的，以中国法律解释为准则。本服务使用者因为违反本声明的规定而触犯中华人民共和国法律的，一切后果自己负责，本服务不承担任何责任。</p>
							<p>运维团队<br />2016年10月2日</p>
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
						label="性别"
						>
						<Radio.Group {...sexProps}>
							<Radio value={0}>男</Radio>
							<Radio value={1}>女</Radio>
						</Radio.Group>
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

						<Form.Item
						{...formItemLayout}
						label="请选择您的专业方向"
						>
						<Select {...selectProps} placeholder="请选择您的专业方向" style={{ width: '100%' }}>
							<Select.Option value={1}>哲学</Select.Option>
							<Select.Option value={2}>经济学</Select.Option>
							<Select.Option value={3}>法学</Select.Option>
							<Select.Option value={4}>教育学</Select.Option>
							<Select.Option value={5}>文学</Select.Option>
							<Select.Option value={6}>历史学</Select.Option>
							<Select.Option value={7}>理学</Select.Option>
							<Select.Option value={8}>工学</Select.Option>
							<Select.Option value={9}>农学</Select.Option>
							<Select.Option value={10}>医学</Select.Option>
							<Select.Option value={11}>军事学</Select.Option>
							<Select.Option value={12}>管理学</Select.Option>
						</Select>
						</Form.Item>

						<Form.Item
						{...formItemLayout}
						label="兴趣爱好(多选)"
						>
						<Select {...multiSelectProps} multiple placeholder="请选择爱好范围" style={{ width: '100%' }}>
							<Select.Option value={1}>哲学</Select.Option>
							<Select.Option value={2}>经济</Select.Option>
							<Select.Option value={3}>法律</Select.Option>
							<Select.Option value={4}>教育</Select.Option>
							<Select.Option value={5}>语言文学</Select.Option>
							<Select.Option value={6}>历史文化</Select.Option>
							<Select.Option value={7}>天文物理</Select.Option>
							<Select.Option value={8}>计算机／互联网</Select.Option>
							<Select.Option value={9}>农业</Select.Option>
							<Select.Option value={10}>医学</Select.Option>
							<Select.Option value={11}>军事政治</Select.Option>
							<Select.Option value={12}>工程</Select.Option>
							<Select.Option value={13}>基础科学</Select.Option>
						  </Select>
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