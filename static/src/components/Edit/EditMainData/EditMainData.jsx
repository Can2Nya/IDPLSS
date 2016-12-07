import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, Icon, Progress, Modal } from 'antd';
import classnames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Qiniu from 'react-qiniu'

import Button from '../../Button/Button';

import styles from './EditMainData.less';
import config from '../../../config/config.js'

let EditMainData = ({ upload, user, form, dispatch }) => {
	// edit编辑一级数据
	const { getFieldProps, validateFields, getFieldValue } = form;
	const { loginUserList } = user
	const { files, token, modalState, progress, isSelectMenuItem, isSelectContextId, isSelectContext, isEdit } = upload
// -----------------form rule-----------------------
	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};
	const keywordProps = getFieldProps(`keyword-${isSelectContextId}`, {
		rules: [
			{ required: true, message:'请输入至少一个关键字', type: 'array'},
		],
	});
	const fileValue = () =>{
		if(files.length <= 0 || !files[0].request.xhr.response) return `${isSelectContext.source_url || isSelectContext.images}`;
		if(files.length > 0 || files[0].request.xhr.response) return `${JSON.parse(files[0].request.xhr.response).key}`
		return null
	}
	const handlePreSubmitData = (formType)=>{
		
		let body = {};
			
			validateFields([`title-${formType}-${isSelectContextId}`,`detail-${formType}-${isSelectContextId}`,`category-${formType}-${isSelectContextId}`],(errors, values) =>{
				if(errors){
					return ;
				}
				if(isSelectMenuItem == '1'){
					validateFields([`file-${formType}-${isSelectContextId}`],(errors, values) =>{
						if(errors){
							return ;
						}
						body = {course_name: getFieldValue(`title-${formType}-${isSelectContextId}`), description: getFieldValue(`detail-${formType}-${isSelectContextId}`), category: getFieldValue(`category-${formType}-${isSelectContextId}`), image: getFieldValue(`file-${formType}-${isSelectContextId}`)}
						handleSubmit(body)
					});
				}
				if(isSelectMenuItem == '2'){
					validateFields([`file-${formType}-${isSelectContextId}`],(errors, values) =>{
						if(errors){
							return ;
						}
						let allWordType = ['other','doc:docx', 'excel', 'pdf', 'ppt']
						let wordType = pathToRegexp(':name.:type').exec(files[0].name)[2]
						let mun = 0;
						allWordType.map((value,index)=>{
							if(value.search(wordType)!= -1) mun = index
						})
						body = {resource_name: getFieldValue(`title-${formType}-${isSelectContextId}`), description: getFieldValue(`detail-${formType}-${isSelectContextId}`), category: getFieldValue(`category-${formType}-${isSelectContextId}`), source_url: getFieldValue(`file-${formType}-${isSelectContextId}`), type: mun}
						handleSubmit(body)
					});
				}
				if(isSelectMenuItem == '3'){
					validateFields([`keyword-${isSelectContextId}`],(errors, values) =>{
						if(errors){
							return ;
						}
						let keyword = '';
						getFieldValue(`keyword-${isSelectContextId}`).map((value,index) => {
							if(index == getFieldValue(`keyword-${isSelectContextId}`).length -1) keyword += `${value}`
							else keyword += `${value}:`
						})
						body = {title: getFieldValue(`title-${formType}-${isSelectContextId}`), description: getFieldValue(`detail-${formType}-${isSelectContextId}`), category: getFieldValue(`category-${formType}-${isSelectContextId}`), key_words: keyword, image: ''}
						handleSubmit(body)
					});
				}
			});
	}
	// --------------action ------------------------
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
		let progresses = {};
		files.map((f) =>{
			f.onprogress = (e) =>{
				progresses[f.preview] = e.percent
				dispatch({
					type: 'upload/setProgress',
					progress: progresses
				})
			}
		})
	}
	const handleSubmit = (body) =>{
		// body = merged(body,{ author_id: loginUserList.user_id })
		if (isSelectMenuItem == '1') {
			dispatch({
				type: 'upload/put/createCourse',
				id: isSelectContextId,
				body: body
			})
		}
		if (isSelectMenuItem == '2') {
			dispatch({
				type: 'upload/put/createText',
				id: isSelectContextId,
				body: body
			})
		}
		if (isSelectMenuItem == '3') {
			dispatch({
				type: 'upload/put/createTest',
				id: isSelectContextId,
				body: body
			})
		}
	}
	// const handleChangeEditState = () =>{
	// 	dispatch({
	// 		type: 'upload/changeEditState',
	// 		isEdit: false,
	// 	})
	// }
	// --------------render------------------------

	// const renderUploadImgCls= () =>{
	// 	if(files.length > 0){
	// 		return { backgroundImage: `url(${files[0].preview})`}
	// 	}
	// }
	const renderUploadText = () =>{
		if(files.length <= 0){
			return (
				<div>
					<Icon type='plus' />
					<div>点击上传文件</div>
				</div>
			)
		}
		else{
			if(!files[0].request.xhr.response) return <Progress percent={progress[files[0].preview].toFixed(0)} strokeWidth={5} status="active" />
			else return <div>{files[0].name}</div>
		}
	}

	const renderForm = (formType)=>{
		return(
			<div>
			<Form.Item
			{...formItemLayout}
			label='标题'
			hasFeedback
			>
				<Input {...getFieldProps(`title-${formType}-${isSelectContextId}`, {
					initialValue: isSelectContext.test_title || isSelectContext.resource_name || isSelectContext.course_name,
					rules: [
						{ required: true, min: 1, max: 15, message: ['题目至少为 2 个字符','题目最多为 15 个字符'] },
					],
				})} type="text" />
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label='描述'
			hasFeedback
			>
				<Input {...getFieldProps(`detail-${formType}-${isSelectContextId}`, {
					initialValue: isSelectContext.test_description || isSelectContext.description,
					rules: [
						{ required: true, min: 1, max: 300, message: ['至少为 2 个字符','最多为 300 个字符'] },
					],
				})} type="textarea" rows={8}/>
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label="分类"
			>
			<Select {...getFieldProps(`category-${formType}-${isSelectContextId}`, {
				rules: [
					{ required: true, message: '请选择分类', type: 'number'},
				],
			})} placeholder="请选择稿件分类" style={{ width: '100%' }}>
			<Select.Option value={1}>计算机/互联网</Select.Option>
			<Select.Option value={2}>基础科学</Select.Option>
			<Select.Option value={3}>工程技术</Select.Option>
			<Select.Option value={4}>历史哲学</Select.Option>
			<Select.Option value={5}>经管法律</Select.Option>
			<Select.Option value={6}>语言文化</Select.Option>
			<Select.Option value={7}>艺术音乐</Select.Option>
			<Select.Option value={8}>兴趣生活</Select.Option>
			</Select>
			</Form.Item>
			</div>
		)
	}
	const renderCourse = ()=>{
		return(
		<div>
		<div className={styles.title}>课程描述</div>
		<Row>
			<Col span={8}>
			<Form.Item 
			help="仅限图片格式,尺寸尽量保持200*120"
			hasFeedback>
			<a>
			<Qiniu 
				onDrop={handleDrop} 
				accept='image/*'
				size={150} 
				style={{border: '0'}}
				token={token} 
				multiple={false}
				onUpload={handleUpload}>
				<div className={styles.preview} style={{ backgroundImage: `url(${config.qiniu}/${fileValue()})` }}>
					<Icon type='plus' />
					<div>点击上传课程封面图</div>

				</div>
			</Qiniu>
			</a>
			<Input type='text' 
			{...getFieldProps(`file-Course-${isSelectContextId}`, {
					initialValue: fileValue(),
					rules: [
						{ required: true },
					],
			})} style={{display: 'none'}} />
			</Form.Item>
			<div className={styles.button}>
				<Button type="ghost" onClick={handlePreSubmitData.bind(this,"Course")}>保存</Button>
				</div>
			</Col>
			<Col span={15}>
			
			{ renderForm("Course") }
			
			</Col>
		</Row>
		<div className={styles.cuttingLine}></div>
		<div className={styles.title}>添加课程视频</div>
		</div>
		)
	}
	const renderText = ()=>{
		return(
		<div>
		<div className={styles.title}>资料描述</div>
		<Row>
			<Col span={8}>
			<Form.Item 
			help="仅限ppt,pdf,doc,docx"
			hasFeedback>
				<a>
			<Qiniu 
				onDrop={handleDrop} 
				accept='application/vnd.ms-powerpoint,application/msword,application/vnd.ms-excel,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
				size={150} 
				style={{border: '0'}}
				token={token} 
				multiple={false}
				onUpload={handleUpload}>
				<div className={styles.preview}>
					{ renderUploadText() }
					
				</div>
			</Qiniu>
			</a>
			<Input type='text' 
			{...getFieldProps(`file-Text-${isSelectContextId}`, {
					initialValue: fileValue(),
					rules: [
						{ required: true },
					],
			})} style={{display: 'none'}} />
			</Form.Item>
			<div className={styles.button}>
				<Button type="ghost" onClick={handlePreSubmitData.bind(this,"Text")}>保存</Button>
			</div>
			</Col>
			<Col span={15}>
			
			{ renderForm("Text") }
			
			</Col>
		</Row>
		</div>
		)
	}
	const renderTest = ()=>{
		return(
		<div>
		<div className={styles.title}>测试描述</div>
		<Row>
			{ renderForm("Test") }
			<Form.Item
			{...formItemLayout}
			label='标签'
			hasFeedback
			>
			<Select tags
			style={{ width: '100%' }}
			{...keywordProps}
			>
			</Select>
			</Form.Item>
			<Form.Item>
				<Button type="ghost" onClick={handlePreSubmitData.bind(this,"Test")}>保存</Button>
			</Form.Item>
		</Row>
		<div className={styles.cuttingLine}></div>
		<div className={styles.title}>添加问题</div>
		</div>
		)
	}
	const renderUploadPannel = () =>{
		switch(isSelectMenuItem){
			case '1': return renderCourse();
			case '2': return renderText();
			case '3': return renderTest();
		}
	}
	return renderUploadPannel()
}

EditMainData = Form.create()(EditMainData);

function mapStateToProp({ upload, user }){
	return{
		upload: upload,
		user: user
	};
}

export default connect(mapStateToProp)(EditMainData);