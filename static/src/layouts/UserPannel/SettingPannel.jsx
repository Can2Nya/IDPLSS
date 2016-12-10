import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Icon, Modal, Form, Input, Radio } from 'antd';
import cookie from 'js-cookie';
import Qiniu from 'react-qiniu'
import merged from 'obj-merged'

import Button from '../../components/Button/Button';

import config from '../../config/config.js';
import styles from './Pannel.less';

let SettingPannel = ({ user, upload, form, dispatch, data, title }) => {
	const { psdtoken, loginUserList } = user
	const { files, token, progress } = upload
	const { getFieldProps, validateFields, getFieldValue, setFieldsValue } = form;
	// const uploadConfig = merged(config.upload,{
	// 	browse_button: 'upload',
	// 	container: 'container',
	// 	max_file_size: '1m',
	// })
	// ---------------form rule----------------

	const fileValue = () =>{
		if(files.length <= 0 || !files[0].request.xhr.response) return `${config.qiniu}/${loginUserList.user_avatar}`;
		if(files.length > 0 || files[0].request.xhr.response) return `${JSON.parse(files[0].request.xhr.response).key}`
		return null
	}

	const formItemLayout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

	const nameProps = getFieldProps('name', {
		rules: [
			{ required: true, min: 2, max: 15, message: ['昵称至少为 2 个字符','昵称最多为 15 个字符'] },
		],
	});

	const aboutProps = getFieldProps('about_me', {
		initialValue: '这个人什么都没写',
		rules: [
			{ required: true, max: 30, message: '介绍最多不超过30个字' },
		],
	});

	// const avatarProps = () =>{
	// 	if(files.length <= 0 || !files[0].request.xhr.response){
	// 		return(
	// 			getFieldProps('avatar', {
	// 				rules: [
	// 					{ required: true },
	// 				],
	// 			})
	// 		)
	// 	}
	// 	else{
	// 		return(
	// 			getFieldProps('avatar', {
	// 				initialValue: JSON.parse(files[0].request.xhr.response).key,
	// 				rules: [
	// 					{ required: true },
	// 				],
	// 			})
	// 		)
	// 	}
	// }

	const sexProps = getFieldProps('sex', {
		rules: [
			{ required: true, message: '请选择您的性别', type: 'number'},
		],
	});
	// const passwordProps = getFieldProps('password', {
	// 	rules: [
	// 		{ required: true, min: 6, message: '密码最少6个字符'},
	// 	],
	// });

	// --------------action--------------------
	const handleDrop = (files) =>{
		dispatch({
			type: 'upload/drop',
			files: files
		})
		files.map((f)=>{
			f.uploadPromise.catch((e)=>{
				Modal.error({
					title: '网络错误',
					context: '请重新点击上传或检查网络是否连接正确'
				})
				dispatch({
					type: 'upload/drop',
					files: []
				})
			})
		})
		
	}
	const handleUpload = (files) =>{
		files.map((f) =>{
			f.onprogress = (e) =>{
				dispatch({
					type: 'upload/setProgress',
					progress: e.percent
				})
			}
		})
	}
	const handleSubmit = (event) =>{
		event.preventDefault();
		validateFields(['name','sex','avatar','about_me'],(errors, values) =>{
			if(errors){
				return ;
			}
			dispatch({
				type: 'user/set/info',
				user_id: cookie.get('user_id'),
				mode: 'setInfo',
				body: {
					name: getFieldValue('name'), 
					sex: getFieldValue('sex'), 
					avatar: getFieldValue('avatar'), 
					about_me: getFieldValue('about_me')
				}
			})
		});
	}
	const handlePostEmail = (event) =>{
		event.preventDefault();
		validateFields(['confirmEmail'],(errors, values) =>{
			if(errors){
				return ;
			}
			dispatch({
				type: 'user/set/info',
				mode: 'email',
				body: {
					user_email: getFieldValue('confirmEmail'), 
				}
			})
		})

	}
	const handlePostPassword = (event) =>{
		event.preventDefault();
		validateFields(['password'],(errors, values) =>{
			if(errors){
				return ;
			}
			dispatch({
				type: 'user/set/info',
				mode: 'password',
				token: token,
				body: {
					user_password: getFieldValue('password')
				}
			})
		})
	}
	// ----------------render------------------
	const renderAvatar = () =>{
		if(files.length <= 0 || !files){
			return(
				<div className={styles.uploadavatar}>
					<Icon type='plus' />
					<div>上传头像</div>
				</div>
			)
		}
		let f = files[0]
		// let res = f.request.xhr.response
		// if(res != ''){
		// 	let key = JSON.parse(res).key
		// 	// setFieldsValue('avatar',key)
		// }

		return <div className={styles.uploadavatar} style={{ backgroundImage: `url(${f.preview})`}}></div>

	}

	return(
		<div className={styles.settingpannel}>
		<Form>
		<div className={styles.cuttingline}>基本信息修改</div>
		<Row>
		
		<Col span={4}>
			<Form.Item 
			help="仅限png,jpg,1m以内"
			hasFeedback>
				<a>
				<Qiniu 
				onDrop={handleDrop.bind(this)} 
				accept='image/*'
				size={150} 
				style={{border: '0'}}
				token={token} 
				multiple={false}
				onUpload={handleUpload.bind(this)}>
				{ renderAvatar() }
				</Qiniu>
				</a>
				<Input type='text' {...getFieldProps('avatar', {
					initialValue: fileValue(),
					rules: [
						{ required: true },
					],
				})} style={{display: 'none'}} />
			</Form.Item>
		</Col>
		<Col span={20}>
			<Form.Item 
			{ ...formItemLayout }
			label="昵称"
			hasFeedback>

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
			{ ...formItemLayout }
			label="自我描述"
			hasFeedback>

				<Input type="textarea" {...aboutProps} />
			</Form.Item>
			
			
		</Col>
		<div style={{ textAlign: 'center' }}>
			<Button type='ghost' onClick={handleSubmit.bind(this)}  >保存</Button>
		</div>
		
		</Row>

		<div className={styles.cuttingline}>密码修改</div>
		{/* psdtoken ?
		
		(<Form.Item 
			{ ...formItemLayout }
			label="新密码"
		hasFeedback>
			<Input type='password' {...getFieldProps('password', {
				rules: [
					{ required: true },
				],
			})}/>
			<Button type='ghost' onClick={handlePostPassword.bind(this)}  >修改</Button>
		</Form.Item>):
		(<Form.Item 
			{ ...formItemLayout }
			label="输入该账户邮箱以验证账户"
		hasFeedback>

			<Input type='text' {...getFieldProps('confirmEmail', {
				rules: [
					{ required: true },
				],
			})} />
			<Button type='ghost' onClick={handlePostEmail.bind(this)}  >发送</Button>
		</Form.Item>)
		
		*/}
		<Form.Item 
			{ ...formItemLayout }
			label="输入该账户邮箱以验证账户"
		hasFeedback>

			<Input type='text' {...getFieldProps('confirmEmail', {
				rules: [
					{ required: true , type: 'email', message: '请输入正确的邮箱地址',},
				],
			})} />
			<Button type='ghost' onClick={handlePostEmail.bind(this)}  >发送</Button>
		</Form.Item>
		</Form>
		</div>
	)
};

SettingPannel.propTypes = {
	//children: PropTypes.element.isRequired,
};

function mapStateToProp({upload,user}){
	return{
		upload: upload,
		user: user
	}
}

SettingPannel = Form.create()(SettingPannel)

export default connect(mapStateToProp)(SettingPannel);
