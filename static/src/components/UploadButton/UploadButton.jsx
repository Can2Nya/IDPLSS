import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Icon, Modal, Form, Input, Select, Progress } from 'antd';
// import classnames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Qiniu from 'react-qiniu'

import Button from '../Button/Button';

import styles from './UploadButton.less';

let UploadButton = ({ form, files, type, modalState, token, qiniuUrl, progress, onCancel, onButtonClick, onSubmit, onUpload, onDrop }) => {

	const { getFieldProps, validateFields, getFieldValue } = form;
	// ----------------fuc--------------------------------------------
	const handlePreSubmitData = (formType)=>{
		// event.preventDefault();
		let body = {};
			
			validateFields([`title-${formType}`,`detail-${formType}`,`category-${formType}`],(errors, values) =>{
				if(errors){
					return ;
				}
				if(type == '1'){
					validateFields([`file-${formType}`],(errors, values) =>{
						if(errors){
							return ;
						}
						body = {course_name: getFieldValue(`title-${formType}`), description: getFieldValue(`detail-${formType}`), category: getFieldValue(`category-${formType}`), images: getFieldValue(`file-${formType}`)}
						onSubmit(body)
					});
				}
				if(type == '2'){
					validateFields([`file-${formType}`],(errors, values) =>{
						if(errors){
							return ;
						}
						let allWordType = ['other','doc:docx', 'excel', 'pdf', 'ppt']
						let wordType = pathToRegexp(':name.:type').exec(files[0].name)[2]
						let mun = 0;
						allWordType.map((value,index)=>{
							if(value.search(wordType)!= -1) mun = index
						})
						body = {resource_name: getFieldValue(`title-${formType}`), description: getFieldValue(`detail-${formType}`), resource_category: getFieldValue(`category-${formType}`), source_url: getFieldValue(`file-${formType}`), resource_type: mun}
						onSubmit(body)
					});
				}
				if(type == '3'){
					validateFields(['keyword'],(errors, values) =>{
						if(errors){
							return ;
						}
						let keyword = '';
						getFieldValue('keyword').map((value,index) => {
							if(index == getFieldValue('keyword').length -1) keyword += `${value}`
							else keyword += `${value}:`
						})
						body = {test_title: getFieldValue(`title-${formType}`), test_description: getFieldValue(`detail-${formType}`), test_category: getFieldValue(`category-${formType}`), key_words: keyword}
						onSubmit(body)
					});
				}
			});
	}
	// --------------form rule----------------------------------------
	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};
	// const titleProps = getFieldProps('title', {
	// 	rules: [
	// 		{ required: true, min: 2, max: 15, message: ['题目至少为 2 个字符','题目最多为 15 个字符'] },
	// 	],
	// });
	// const detailProps = getFieldProps('detail', {
	// 	rules: [
	// 		{ required: true, min: 2, max: 300, message: ['至少为 2 个字符','最多为 300 个字符'] },
	// 	],
	// });
	// const selectProps = getFieldProps('category', {
	// 	rules: [
	// 	{ required: true, message: '请选择分类', type: 'number'},
	// 	],
	// });
	const keywordProps = getFieldProps('keyword', {
		rules: [
			{ required: true, message:'请输入至少一个关键字', type: 'array'},
		],
	});
	// const fileProps = () =>{
	// 	if(files.length <= 0 || !files[0].request.xhr.response){
	// 		return(
	// 			getFieldProps('file', {
	// 				rules: [
	// 					{ required: true },
	// 				],
	// 			})
	// 		)
	// 	}
	// 	else{
	// 		return(
	// 			getFieldProps('file', {
	// 				initialValue: `${qiniuUrl}/${JSON.parse(files[0].request.xhr.response).key}`,
	// 				rules: [
	// 					{ required: true },
	// 				],
	// 			})
	// 		)
	// 	}
	// }
	const fileValue = () =>{
		if(files.length <= 0 || !files[0].request.xhr.response) return '';
		else return `${qiniuUrl}/${JSON.parse(files[0].request.xhr.response).key}`
	}
	// -------------------------render---------------------------
	const renderUploadImgCls= () =>{
		if(files.length > 0){
			return { backgroundImage: `url(${files[0].preview})`}
		}
	}
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
				<Input {...getFieldProps(`title-${formType}`, {
					rules: [
						{ required: true, min: 2, max: 15, message: ['题目至少为 2 个字符','题目最多为 15 个字符'] },
					],
				})} type="text" />
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label='描述'
			hasFeedback
			>
				<Input {...getFieldProps(`detail-${formType}`, {
					rules: [
						{ required: true, min: 2, max: 300, message: ['至少为 2 个字符','最多为 300 个字符'] },
					],
				})} type="textarea" rows={6}/>
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label="分类"
			>
			<Select {...getFieldProps(`category-${formType}`, {
				rules: [
					{ required: true, message: '请选择分类', type: 'number'},
				],
			})} placeholder="请选择稿件分类" style={{ width: '100%' }}>
			<Select.Option value={0}>计算机/互联网</Select.Option>
			<Select.Option value={1}>基础科学</Select.Option>
			<Select.Option value={2}>工程技术</Select.Option>
			<Select.Option value={3}>历史哲学</Select.Option>
			<Select.Option value={4}>经管法律</Select.Option>
			<Select.Option value={5}>语言文化</Select.Option>
			<Select.Option value={6}>艺术音乐</Select.Option>
			<Select.Option value={7}>兴趣生活</Select.Option>
			</Select>
			</Form.Item>
			</div>
		)
	}
	const renderCourse = ()=>{
		return(
		<div>
		<Button type='ghost' onClick={onButtonClick}>创建课程</Button>
		<Modal title="创建课程" 
		width={900}
		visible={modalState} 
		onOk={handlePreSubmitData.bind(this,"Course")} onCancel={onCancel}
		>
		<Form>
		<Row>
			<Col span={8}>
			<Form.Item 
			help="仅限图片格式,尺寸尽量保持200*120"
			hasFeedback>
			<a>
			<Qiniu 
				onDrop={onDrop} 
				accept='image/*'
				size={150} 
				style={{border: '0'}}
				token={token} 
				multiple={false}
				onUpload={onUpload}>
				<div className={styles.preview} style={renderUploadImgCls()}>
					<Icon type='plus' />
					<div>点击上传课程封面图</div>

				</div>
			</Qiniu>
			</a>
			<Input type='text' 
			{...getFieldProps('file-Course', {
					initialValue: fileValue(),
					rules: [
						{ required: true },
					],
			})} style={{display: 'none'}} />
			</Form.Item>
			</Col>
			<Col span={15}>
			
			{ renderForm("Course") }
			
			</Col>
		</Row>
		</Form>
		</Modal>
		</div>
		)
	}
	const renderText = ()=>{
		return(
		<div>
		<Button type='ghost' onClick={onButtonClick}>上传资料</Button>
		<Modal title="上传资料" 
		width={900}
		visible={modalState} 
		onOk={handlePreSubmitData.bind(this,"Text")} onCancel={onCancel}
		>
		<Form>
		<Row>
			<Col span={8}>
			<Form.Item 
			help="仅限ppt,pdf,doc,docx"
			hasFeedback>
				<a>
			<Qiniu 
				onDrop={onDrop} 
				accept='application/vnd.ms-powerpoint,application/msword,application/vnd.ms-excel,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
				size={150} 
				style={{border: '0'}}
				token={token} 
				multiple={false}
				onUpload={onUpload}>
				<div className={styles.preview}>
					{ renderUploadText() }
					
				</div>
			</Qiniu>
			</a>
			<Input type='text' 
			{...getFieldProps('file-Text', {
					initialValue: fileValue(),
					rules: [
						{ required: true },
					],
			})} style={{display: 'none'}} />
			</Form.Item>
			</Col>
			<Col span={15}>
			
			{ renderForm("Text") }
			
			</Col>
		</Row>
		</Form>
		</Modal>
		</div>
		)
	}
	const renderTest = ()=>{
		return(
		<div>
		<Button type='ghost' onClick={onButtonClick}>创建测试</Button>
		<Modal title="创建测试" 
		width={900}
		visible={modalState} 
		onOk={handlePreSubmitData.bind(this,"Test")} onCancel={onCancel}
		>
		<Form>
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
		</Row>
		</Form>
		</Modal>
		</div>
		)
	}
	const renderUploadButton = () =>{
		switch(type){
			case '1': return renderCourse();
			case '2': return renderText();
			case '3': return renderTest();
		}
	}
	return (
		<div>
		{ renderUploadButton() }
		</div>
	);
}

UploadButton = Form.create()(UploadButton);

export default UploadButton;