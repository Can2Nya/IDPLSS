import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import cookie from 'js-cookie';
import base64 from 'base-64';

//import { data } from '../../../services/user.js';//向user传送的数据

import { Popover, Modal, Form, Input } from 'antd';
import QueueAnim from 'rc-queue-anim';//动画效果

import config from '../../../config/config';
import styles from './User.less';

let User = ({ user, dispatch, textStyle, form }) => {
	const { psdtoken, loginUserList, modalState, loginFormisSubmit } = user;
	
	const { validateFields, getFieldProps, getFieldValue } = form;
	const formItemLayout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

	const handleModelToggle = () =>{
		dispatch({
			type: 'user/login/modal/toggle',
			modalState: !modalState,
		})
	}
	const handleLogin = ()=>{
		const data = form.getFieldsValue();
		cookie.set('authorization','Basic '+base64.encode(data.username+":"+data.password))
		dispatch({
			type: 'user/login',
			body: { user_name_or_email: data.username, user_password: data.password }
		})
	}
	const handleLogout = ()=>{
		dispatch({
			type: 'user/logout',
		})
	}

	const handleReComfrim = ()=>{
		dispatch({
			type: 'user/set/info',
			mode: 'recomfirm',
			body: {
				user_email: loginUserList.user_email
			}
		})
	}
	const handlePostPassword = () =>{
		validateFields(['password'],(errors, values) =>{
			if(errors){
				return ;
			}
			dispatch({
				type: 'user/set/info',
				mode: 'password',
				psdtoken: psdtoken,
				body: {
					user_password: getFieldValue('password')
				}
			})
		})
	}
	const renderUser = () =>{
		
		if(loginUserList.length <= 0) return(
			<div className={styles.text}>
			<Link to='/register/'><span className={styles.item} style={textStyle}>注册</span></Link>
			<a><span className={styles.item} style={textStyle} onClick={handleModelToggle.bind(this)} >登录</span></a>

			<Modal title='登录' 
			visible={modalState} 
			confirmLoading={loginFormisSubmit} 
			onCancel={handleModelToggle.bind(this)}
			onOk={handleLogin.bind(this)}
			okText='登陆'
			cancelText='忘记密码？'
			>

				<Form horizontal>
					<QueueAnim 
					animConfig={[
		            { opacity: [1, 0], translateY: [0, 50] },
		            { opacity: [1, 0], translateY: [50, 0] }
		          ]}
		          	delay={100}
		          >

					{modalState?[
						<Form.Item 
						{ ...formItemLayout }
						label="用户名" key='1' >
							<Input {...getFieldProps('username',{})} type='text' />
						</Form.Item>,//这个逗号非常重要！！！
						<Form.Item 
						{ ...formItemLayout }
						label="密码" key='2' >
							<Input {...getFieldProps('password',{})} type='password' onPressEnter={handleLogin.bind(this)} />
						</Form.Item>,
					] : null}

					</QueueAnim>
				</Form>
			</Modal>
			</div>
			);
		if(!loginUserList.user_role_iduser_confirmed){// 
			return(
				<Modal title='阿呀！出错了' visible={true} onOk={handleReComfrim.bind(this)}>
					<p>您的账户似乎没经过邮箱激活</p>
					<p>点确定发送验证到你的邮箱{`${loginUserList.user_email}`}</p>
					<p>反正你不点我也不会消失</p>
				</Modal>
			)
		}
		if(psdtoken){
			return(
				<Modal title='修改密码' visible={true} onOk={handlePostPassword}
				onCancel={()=>{
					dispatch({
						type: 'user/get/passwordToken',
						psdtoken: null
					})
				}}>
				<Form>
				<Form.Item 
				{ ...formItemLayout }
				label="新密码"
				hasFeedback>
				<Input type='password' {...getFieldProps('password', {
				rules: [
				{ required: true },
				],
				})}/>
				</Form.Item>
				</Form>
			</Modal>
			)
		}
		else {
			const renderList =() =>{
				return(
					<div className={styles.list}>
						{/**loginUserList.map((item,index) => {
							if(index == loginUserList.length-1) var one={'border':0};
							return(
							<div className={styles.item} key={index} style={one}>
							{item}
							</div>)
						})*/}
					<div className={styles.item}>{ loginUserList.name }</div>
					<Link to={{pathname: `/user/${ loginUserList.user_id }/`, hash: '#!/dynamic/0/' }} ><div className={styles.item}>个人中心</div></Link>
					<Link to={{pathname: `/user/${ loginUserList.user_id }/`, hash: '#!/setting/0/' }} ><div className={styles.item}>设置</div></Link>
					<Link to={{pathname: `/manage/` }} ><div className={styles.item}>资源管理</div></Link>
					<a><div className={styles.item} style={{'border':0}} onClick={handleLogout.bind(this)}>退出</div></a>
					</div>
				);
			}
			const renderUserAvator = {
				backgroundImage: `url(${config.qiniu}/${loginUserList.user_avatar})`
			}
			return (
			<Popover placement="bottomRight" content={renderList()} overlayStyle={{padding:0}}>
				<div className={styles.userImg} style={renderUserAvator}></div>
			</Popover>
			);
		}
	}
	return renderUser();
}

User.propTypes = {  
	//text: PropTypes.element.isRequired,
	/*text: PropTypes.oneOfType([
	      React.PropTypes.string,
	      React.PropTypes.number,
  ]),*/
};

User = Form.create()(User);//创建表单方法

function mapStateToProps({ user }){
	return {
		user: user,
	};
};



export default connect(mapStateToProps)(User);