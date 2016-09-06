import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Popover, Modal, Form, Input } from 'antd';

import styles from './User.less';

let User = ({ user, dispatch, textStyle, form }) => {
	const { list, modalState, isSubmit } = user;
	
	const { getFieldProps } = form;
	const handleModelToggle = () =>{
		dispatch({
			type: 'user/modal/toggle',
			modalState: modalState,
		})
	}
	const handleLoginSubmit = ()=>{
		console.log(form.getFieldsValue());
		dispatch({
			type: 'user/modal/submit',
			isSubmit: isSubmit,
		})
	}
	const renderUser = () =>{
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
				<div className={styles.item}>name</div>
				<div className={styles.item}>个人中心</div>
				<div className={styles.item}>设置</div>
				<div className={styles.item} style={{'border':0}}>退出</div>
				</div>
			);
		}

		if(list.length <= 0) return(
			<div className={styles.text}>
			<span className={styles.item} style={textStyle}>注册</span>
			<span className={styles.item} style={textStyle} onClick={handleModelToggle.bind(this)} >登录</span>

			<Modal title='登录' visible={modalState} confirmLoading={isSubmit} 
				   onCancel={handleModelToggle.bind(this)}
				   onOk={handleLoginSubmit.bind(this)}>

				<Form horizontal>
					<Form.Item label="用户名">
						<Input {...getFieldProps('username',{})} type='text' />
					</Form.Item>
					<Form.Item label="密码">
						<Input {...getFieldProps('password',{})} type='password' />
					</Form.Item>
				</Form>
			</Modal>
			</div>
			);
		return (
			<Popover placement="bottomRight" content={renderList()} overlayStyle={{padding:0}}>
				<div className={styles.userImg}></div>
			</Popover>
			);
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