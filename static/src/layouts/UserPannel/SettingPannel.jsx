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

let SettingPannel = ({ upload, form, dispatch, data, title }) => {

	const { files, token, progress } = upload
	const { getFieldProps, validateFields, getFieldValue, setFieldsValue } = form;
	// const uploadConfig = merged(config.upload,{
	// 	browse_button: 'upload',
	// 	container: 'container',
	// 	max_file_size: '1m',
	// })
	// ---------------form rule----------------

	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 14 },
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

	const avatarProps = () =>{
		if(files.length <= 0 || !files[0].request.xhr.response){
			return(
				getFieldProps('avatar', {
					rules: [
						{ required: true },
					],
				})
			)
		}
		else{
			return(
				getFieldProps('avatar', {
					initialValue: JSON.parse(files[0].request.xhr.response).key,
					rules: [
						{ required: true },
					],
				})
			)
		}
	}

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
		validateFields((errors, values) =>{
			if(errors){
				return ;
			}
			// data['body'] = form.getFieldsValue(['user_name','user_email','user_password']);//传输表单信息

			// dispatch({
			// 	type:'user/register',
			// 	body: form.getFieldsValue(['user_name','user_email','user_password'])
			// })
			dispatch({
				type: 'user/set/info',
				user_id: cookie.get('user_id'),
				body: {
					name: getFieldValue('name'), 
					sex: getFieldValue('sex'), 
					avatar: getFieldValue('avatar'), 
					about_me: getFieldValue('about_me')
				}
			})
		});
		
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
	// const UploadAvatar = React.createClass({
	// 	componentDidMount()	{
	// 		console.log(Qiniu)
	// 		// Qiniu.uploader(uploadConfig)
	// 	},
	// 	render(){
	// 		return(
	// 		<a>
	// 		<Qiniu onDrop={this.onDrop} size={150} token={this.state.token} uploadKey={this.state.uploadKey} onUpload={this.onUpload}>
	// 		<div className={styles.uploadavatar}>
	// 			<Icon type='plus' />
	// 			<div>上传头像</div>
	// 		</div>
	// 		</Qiniu>
	// 		</a>
	// 		)
	// 	}
	// })

	return(
		<div className={styles.settingpannel}>
		<Row>
		<Form>
		<Col span={5}>
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
				<Input type='text' {...avatarProps()} style={{display: 'none'}} />
			</Form.Item>
		</Col>
		<Col span={19}>
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
			{/*<Form.Item 
			{ ...formItemLayout }
			label="新密码"
			hasFeedback>
				<Input type='password' {...passwordProps}/>
			</Form.Item>*/}
			
		</Col>
		<Button type='ghost' onClick={handleSubmit.bind(this)} >提交</Button>
		</Form>
		</Row>
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
