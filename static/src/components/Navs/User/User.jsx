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
	const { list, modalState, loginFormisSubmit } = user;
	
	const { getFieldProps } = form;
	const handleModelToggle = () =>{
		dispatch({
			type: 'user/login/modal/toggle',
			modalState: modalState,
		})
	}
	const handleLogin = ()=>{
		const data = form.getFieldsValue();
		cookie.set('authorization','Basic '+base64.encode(data.username+":"+data.password))
		dispatch({
			type: 'user/login',
			userId: data.username
		})
	}
	const handleLogout = ()=>{
		cookie.remove('authorization')
		dispatch({
			type: 'user/logout',
		})
	}
	const renderUser = () =>{
		
		if(list.length <= 0) return(
			<div className={styles.text}>
			<Link to='/register/'><span className={styles.item} style={textStyle}>注册</span></Link>
			<a><span className={styles.item} style={textStyle} onClick={handleModelToggle.bind(this)} >登录</span></a>

			<Modal title='登录' visible={modalState} confirmLoading={loginFormisSubmit} 
				   onCancel={handleModelToggle.bind(this)}
				   onOk={handleLogin.bind(this)}>

				<Form horizontal>
					<QueueAnim 
					animConfig={[
		            { opacity: [1, 0], translateY: [0, 50] },
		            { opacity: [1, 0], translateY: [50, 0] }
		          ]}
		          	delay={100}
		          >

					{modalState?[
						<Form.Item label="用户名" key='1' >
							<Input {...getFieldProps('username',{})} type='text' />
						</Form.Item>,//这个逗号非常重要！！！
						<Form.Item label="密码" key='2' >
							<Input {...getFieldProps('password',{})} type='password' />
						</Form.Item>,
					] : null}

					</QueueAnim>
				</Form>
			</Modal>
			</div>
			);
		else {
			const renderList =() =>{
				return(
					<div className={styles.list}>
						{/**list.map((item,index) => {
							if(index == list.length-1) var one={'border':0};
							return(
							<div className={styles.item} key={index} style={one}>
							{item}
							</div>)
						})*/}
					<div className={styles.item}>{ list.name }</div>
					<Link to={{pathname: `/user/${ list.user_id }/`, hash: '#!/dynamic/' }} ><div className={styles.item}>个人中心</div></Link>
					<Link to={{pathname: `/user/${ list.user_id }/`, hash: '#!/setting/' }} ><div className={styles.item}>设置</div></Link>
					<a><div className={styles.item} style={{'border':0}} onClick={handleLogout.bind(this)}>退出</div></a>
					</div>
				);
			}
			const renderUserAvator = {
				backgroundImage: "url("+config.qiniu+'/'+list.user_avatar+")"
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