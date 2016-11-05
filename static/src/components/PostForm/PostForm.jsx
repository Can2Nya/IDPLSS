import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, Modal, Icon } from 'antd';
import classNames from 'classnames';
import Qiniu from 'react-qiniu'

import Button from '../Button/Button';

import styles from './PostForm.less';

let PostForm = ({ user, upload, dispatch, form }) => {
	const { getFieldProps, validateFields, getFieldValue } = form;
	const { loginUserList } = user
	const { tmpFile, uploadList, uploadListFiles, uploadListProgress, token, time, modalState, isSelectMenuItem, isSelectContextId, isSelectContext, isSelectContextList } = upload
	// -------------action------------------

	const handleToggleForumModal = () =>{//表单modal显
		dispatch({
			type: 'upload/changeModalState',
			modalState: !modalState
		})
	}

	const handleSubmitPost = () =>{//post表单发送
		validateFields([`title-${time}`,`postCategory-${time}`,`detail-${time}`],(errors, values) =>{
			if(errors){
				return ;
			}
			let images = ''
			if(getFieldValue(`file-${time}`).length > 0){
				getFieldValue(`file-${time}`).map((value,index) => {
					if(index == getFieldValue(`file-${time}`).length -1) images += `${value}`
					else images += `${value}:`
				})
			}
			dispatch({
				type: 'upload/post/createPost',
				body: {body: getFieldValue(`detail-${time}`), post_category: getFieldValue(`postCategory-${time}`), author_id: loginUserList.user_id, title: getFieldValue(`title-${time}`), images: images }
			})
		})
		
	}
	const handleDrop = (file) =>{
		dispatch({
			type: 'upload/multiplyPlus',
			uploadListFiles: file
		})
	}
	const handleUpload = (files) =>{
		let progresses = {};
		files.map((f) =>{
			f.onprogress = (e) =>{
				progresses[f.preview] = e.percent
				dispatch({
					type: 'upload/setMultiplyProgress',
					uploadListProgress: progresses
				})
			}
		})
	}
	// const formItemLayout = {
	// 	labelCol: { span: 6 },
	// 	wrapperCol: { span: 16 },
	// };
	// ----------------------render-------------------------
	const fileValue = () =>{
		let filelist = [];
		if(uploadListFiles.length <= 0) return filelist;
		else{
			uploadListFiles.map((file,index)=>{
				if(file.request.xhr.response) filelist = [ ...filelist, `${JSON.parse(file.request.xhr.response).key}`]
			})
			return filelist;
		}
	}
	
	const renderUploadItem = () =>{
		if(uploadListFiles.length <= 0) return;
		else{
			 return uploadListFiles.map((data,index) => {
				return(
					<div className={styles.preview} key={index} style={{ backgroundImage: `url(${data.preview})`}}>
					</div>
				)
			})
		}
	}
	return (
		<div >
		{/*<Button type="ghost" onClick={ onClick.bind(this) } >
		发布帖子
		</Button>*/}
		<div className={styles.block} >
		<a onClick={handleToggleForumModal.bind(this)}>发布帖子</a>
		</div>
		<Modal title='发布帖子' 
		width={900} 
		visible={modalState} 
		/*confirmLoading={confirmLoading}*/
		onCancel={handleToggleForumModal.bind(this)}
		onOk={handleSubmitPost.bind(this)}
		>
			<Form>
			<Row>
			
			<Col span={18}>
			<Form.Item 
			label='标题'
			labelCol={{ span: 2 }}
			wrapperCol={{ span:21 }}
			>
				<Input {...getFieldProps(`title-${time}`, {
					rules: [
						{ required: true, min: 2, max: 30, message: ['至少为 2 个字符','最多为 30 个字符'] },
					],
				})}/>
			</Form.Item>
			</Col>
			<Col span={6}>
			<Form.Item 
			label='分类'
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 16 }}
			>
				<Select {...getFieldProps(`postCategory-${time}`, {
					rules: [
						{ required: true, message: '请选择分类', type: 'number'},
					],
				})} style={{ width: '100%' }}>
					<Select.Option value={0} key='0'>互联网/计算机</Select.Option>
					<Select.Option value={1} key='1'>基础科学</Select.Option>
					<Select.Option value={2} key='2'>工程技术</Select.Option>
					<Select.Option value={3} key='3'>历史哲学</Select.Option>
					<Select.Option value={4} key='4'>经管法律</Select.Option>
					<Select.Option value={5} key='5'>语言文学</Select.Option>
					<Select.Option value={6} key='6'>艺术音乐</Select.Option>
					<Select.Option value={7} key='7'>兴趣生活</Select.Option>
					
				</Select>
			</Form.Item>
			</Col>
			</Row>
			<Row>
			<Form.Item>
				<Input type='textarea' rows={6} placeholder="编辑想说的内容" 
					{...getFieldProps(`detail-${time}`, {
						rules: [
							{ required: true, min: 2, max: 1000, message: ['至少为 2 个字符','最多为 1000 个字符'] },
						],
					})}
				/>
			</Form.Item>
			</Row>
			<Row>
			<Form.Item>
				<Select tags
				{...getFieldProps(`file-${time}`, {
						initialValue: fileValue(),
						rules: [
							{ required: true, type: 'array' },
						],
				})} style={{display: 'none'}}>
				</Select>
				<Qiniu 
					onDrop={handleDrop} 
					accept='image/*'
					size={150} 
					style={{border: '0'}}
					token={token} 
					multiple={true}
					onUpload={handleUpload}>
					<div className={styles.preview}>
						<div>
							<Icon type='plus' />
							<div>点击上传图片</div>
						</div>
					</div>
				</Qiniu>
				{ renderUploadItem() }
			</Form.Item>
			</Row>
			</Form>
		</Modal>
		</div>
	);
};

PostForm.propTypes = {  
	
};

PostForm = Form.create()(PostForm)

function mapStateToProp({ user, upload }){
	return{
		user: user,
		upload: upload,
	};
}

export default connect(mapStateToProp)(PostForm);