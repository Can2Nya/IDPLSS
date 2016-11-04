import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, Icon, Progress, Modal } from 'antd';
import Sortable, { SortableContainer, sortable } from 'react-anything-sortable';
import classnames from 'classnames';
import Qiniu from 'react-qiniu'

import Button from '../../Button/Button';
import UploadItem from '../../Widget/UploadItem/UploadItem';

import styles from './UploadQueue.less';
import 'react-anything-sortable/sortable.css';

@sortable
class SortItem extends React.Component{
	render() {
	return(
		<div className={this.props.className}
						style={this.props.style}
						onMouseDown={this.props.onMouseDown}
						onTouchStart={this.props.onTouchStart}>
					<div>
					{ this.props.children }
					</div>
				</div>
			)
		}
}

let UploadQueue = ({ upload, user, form, dispatch }) => {
	const { getFieldProps, validateFields, getFieldValue } = form;
	const { loginUserList } = user
	const { tmpFile, uploadList, uploadListFiles, uploadListProgress, token, time, modalState, isSelectMenuItem, isSelectContextId, isSelectContext, isSelectContextList } = upload
	
	// @sortable
	// const SortItem = React.createClass({
	// 	render() {
	// 		return(
	// 			<div className={this.props.className}
	// 					style={this.props.style}
	// 					onMouseDown={this.props.onMouseDown}
	// 					onTouchStart={this.props.onTouchStart}>
	// 				<div>
	// 				{ children }
	// 				</div>
	// 			</div>
	// 		)
	// 	}
	// })

	// -----------form rule-------------------
	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};
	// -----------action----------------------
	const handleAdd = ()=>{
		// // event.preventDefault();
		// let body = {};
			
		// 	validateFields(`file-${formType}-${time}`,(errors, values) =>{
		// 		if(errors){
		// 			return ;
		// 		}
		// 		if(isSelectMenuItem == '1'){
		// 			body = {course_name: getFieldValue(`title-${formType}`), description: getFieldValue(`detail-${formType}`), category: getFieldValue(`category-${formType}`), images: getFieldValue(`file-${formType}`)}
		// 			onSubmit(body)
		// 		}
		// 		if(isSelectMenuItem == '3'){
		// 			validateFields(['keyword'],(errors, values) =>{
		// 				if(errors){
		// 					return ;
		// 				}
		// 				let keyword = '';
		// 				getFieldValue('keyword').map((value,index) => {
		// 					if(index == getFieldValue('keyword').length -1) keyword += `${value}`
		// 					else keyword += `${value}:`
		// 				})
		// 				body = {test_title: getFieldValue(`title-${formType}`), test_description: getFieldValue(`detail-${formType}`), test_category: getFieldValue(`category-${formType}`), key_words: keyword}
		// 				onSubmit(body)
		// 			});
		// 		}
		// 	});
		if (tmpFile.length > 0) {
			dispatch({
				type: 'upload/multiplyPlusUploadList',
				uploadList: { file: tmpFile, video_name: getFieldValue(`title-Course-${time}`)}
			})
			dispatch({
				type: 'upload/tmpPlus',
				tmpFile: []
			})
			dispatch({
			type: 'upload/changeModalState',
			modalState: false
		})
		};
		
	}
	const handleSort = (e) =>{
		console.log(e)
	}

	const handleChangeModalState = () =>{
		dispatch({
			type: 'upload/changeModalState',
			modalState: !modalState
		})
	}
	const handleDrop = (file) =>{
		dispatch({
			type: 'upload/multiplyPlus',
			uploadListFiles: file
		})
		dispatch({
			type: 'upload/tmpPlus',
			tmpFile: file
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
	const renderUploadText = () =>{//添加文件的modal
				// return (
				// 	<div>
				// 		<Icon type='plus' />
				// 		<div>点击上传文件</div>
				// 	</div>
				// )
		
			if(tmpFile.length <= 0 ){
				return (
					<div>
						<Icon type='plus' />
						<div>点击上传文件</div>
					</div>
				)
			}
			else{
				if(!tmpFile[0].request.xhr.response) return <Progress percent={uploadListProgress[tmpFile[0].preview].toFixed(0)} strokeWidth={5} status="active" />
				else return <div>{tmpFile[0].name}</div>
			}
		
	}

	// --------render-------------------------
	// const fileValue = () =>{
	// 	if(files.length <= 0 || !files[0].request.xhr.response) return '${data.source_url}';
	// 	else return `${JSON.parse(files[0].request.xhr.response).key}`
	// }
	const renderUploadItem = () =>{
		let list = [];
		list = list.concat(uploadList,isSelectContextList)
		if(list.length <= 0) return <div>点击左下上传视频吧</div>;
		else{
			 return list.map((data,index) => {
				console.log(1)
				// console.log(data.file[0])
				//  data有两种可能，一是原有一存在的视频，二是刚上传的东西【测试不存在视频】
				// 刚上传的东西 包含 { file:[], "video_name", "video_description"}//视频
				// {file:[],problem_description, problem_type, "choice_a": 3.12,      // 选项a的内容，下面类推"choice_b":12,"choice_c":13,"choice_d":14, }
				return(
					// <div className='dynamic-item' sortData={`${data.file[0].preview}`} key={index}>
					// <div>
					// <UploadItem data={data} />
					// </div>
					// </div>
					<SortItem className='dynamic-item' sortData={`${data.file[0].preview}`} key={index} >
					<UploadItem data={data} />
					</SortItem>
				)
			})
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
				<Input {...getFieldProps(`title-${formType}-${time}`, {
					// initialValue: data.video_name || data.course_name || null,
					rules: [
						{ required: true, min: 2, max: 15, message: ['至少为 2 个字符','最多为 15 个字符'] },
					],
				})} type="text" />
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label='描述'
			hasFeedback
			>
				<Input {...getFieldProps(`detail-${formType}-${time}`, {
					// initialValue: isSelectContext.video_description || isSelectContext.test_description || null,
					rules: [
						{ required: true, min: 2, max: 300, message: ['至少为 2 个字符','最多为 300 个字符'] },
					],
				})} type="textarea" />
			</Form.Item>
			</div>
		)
	}
	const renderCourse = ()=>{
		return(
			<Modal title="添加视频" 
			width={700}
			visible={modalState} 
			onOk={handleAdd.bind(this)} onCancel={handleChangeModalState.bind(this)}
			>
			<Form>
			<Row>
				<Col span={8}>
				<Form.Item 
				help="仅限视频格式"
				hasFeedback>
					<a>
				<Qiniu 
					onDrop={handleDrop} 
					accept='video/*'
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
				{...getFieldProps('file-Course-${time}', {
						// initialValue: fileValue(),
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
		)
	}
	const renderTest = ()=>{
		return(
			<Modal title="添加问题" 
			width={700}
			visible={modalState} 
			onOk={handleAdd.bind(this)} onCancel={handleChangeModalState.bind(this)}
			>
			<Form>
			<Row>
				<Col span={8}>
				<Form.Item 
				help="仅限图片格式"
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
					<div className={styles.preview}>
						{ renderUploadText() }
						
					</div>
				</Qiniu>
				</a>
				<Input type='text' 
				{...getFieldProps('file-Test-${time}', {
						// initialValue: fileValue(),
						rules: [
							{ required: true },
						],
				})} style={{display: 'none'}} />
				</Form.Item>
				</Col>
				<Col span={15}>
				
				{ renderForm("Test") }
				
				</Col>
			</Row>
			</Form>
		</Modal>
		)
	}
	const renderUploadPannel = () =>{
		switch(isSelectMenuItem){
			case '1': return renderCourse();
			case '3': return renderTest();
		}
	}

	return(
		<div>
		<div className={styles.contain}>
		<Sortable onSort={handleSort.bind(this)} dynamic>
		{/*<SortableContainer sortData="1" key='1'>
		<div>
		<UploadItem data={{title: '这里是1'}} />
		</div>
		</SortableContainer>
		<SortableContainer sortData="2" key='2'>
		<div>
		<UploadItem data={{title: '这里是2'}} />
		</div>
		</SortableContainer>*/}
	
		{ renderUploadItem() }
		</Sortable>
		</div>
		<Button type='ghost' onClick={handleChangeModalState.bind(this)}>添加</Button>
		<Button type='ghost'>保存列表</Button>
		{ renderUploadPannel() }
		</div>
	)
}

UploadQueue.propTypes = {  
	/*title: PropTypes.string.isRequired,*/
};

UploadQueue = Form.create()(UploadQueue)


function mapStateToProp({ upload, user }){
	return{
		upload: upload,
		user: user
	};
}

export default connect(mapStateToProp)(UploadQueue);