import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, Icon, Progress } from 'antd';
import Sortable, { SortableContainer } from 'react-anything-sortable';
import pathToRegexp from 'path-to-regexp';
import merged from 'obj-merged'

import config from '../../config/config.js';
import styles from './EditPannel.less';
import 'react-anything-sortable/sortable.css';

import Button from '../../components/Button/Button';

import UploadItem from '../../components/Widget/UploadItem/UploadItem';
import EditMainData from '../../components/Edit/EditMainData/EditMainData';
import UploadQueue from '../../components/Edit/UploadQueue/UploadQueue';


let EditPannel = ({ upload, user, form, dispatch }) => {

	const { getFieldProps, validateFields, getFieldValue } = form;
	const { loginUserList } = user
	const { files, token, modalState, progress, isSelectMenuItem, isSelectContextId, isSelectContext, isEdit } = upload
// -----------------action-----------------------
	
	const handleChangeEditState = () =>{
		dispatch({
			type: 'upload/changeEditState',
			isEdit: false,
		})
		dispatch({
			type: 'upload/multiplyPlusUploadList',
			uploadList: []
		})
		dispatch({
			type: 'upload/multiplyPlus',
			uploadListFiles: []
		})
	}
	/*
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
						{ required: true, min: 2, max: 15, message: ['题目至少为 2 个字符','题目最多为 15 个字符'] },
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
						{ required: true, min: 2, max: 300, message: ['至少为 2 个字符','最多为 300 个字符'] },
					],
				})} type="textarea" />
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
				<div className={styles.preview} style={{ backgroundImage: `url(${fileValue()})` }}>
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
	}*/
	
	return (
		<div className={styles.block}>
		<div className={styles.cuttingLine}>
		<a>
		<span onClick={handleChangeEditState}>
		<Icon type="arrow-left" /> 
		 返回
		</span>
		</a>
		</div>

		<EditMainData />
		{/*<div className={styles.contain}>
		<Sortable onSort={handleSort.bind(this)}>
		<SortableContainer sortData="1" key='1'>
		<div>
		<UploadItem data={{title: '这里是1'}} />
		</div>
		</SortableContainer>
		<SortableContainer sortData="2" key='2'>
		<div>
		<UploadItem data={{title: '这里是2'}} />
		</div>
		</SortableContainer>
		</Sortable>
		</div>
		<Button type='ghost'>添加</Button>
		<Button type='ghost'>保存列表</Button>*/}
		{ isSelectMenuItem == 2 ? null : <UploadQueue />}
		
		</div>
	);
};

EditPannel.propTypes = {
	//children: PropTypes.element.isRequired,
};
// function mapPropToFields(upload){
// 	console.log(upload)
// 	return{

// 	}
// }

EditPannel = Form.create()(EditPannel)

function mapStateToProp({ upload, user }){
	return{
		upload: upload,
		user: user
	};
}

export default connect(mapStateToProp)(EditPannel);
