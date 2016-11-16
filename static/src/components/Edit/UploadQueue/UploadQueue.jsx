import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, Radio, Icon, Progress, Modal, message } from 'antd';
import Sortable, { SortableContainer, sortable } from 'react-anything-sortable';
import classnames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Qiniu from 'react-qiniu'

import Button from '../../Button/Button';
import UploadItem from '../../Widget/UploadItem/UploadItem';
import config from '../../../config/config.js'

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
	const { itemIndex, order,itemData, tmpFile, uploadList, uploadListFiles, uploadListProgress, token, time, modalState, isSelectMenuItem, isSelectContextId, isSelectContext, isSelectContextList } = upload
	
	// -----------form rule-------------------
	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};
	// -----------action----------------------
	const isChangeorAdd = () =>{
		let itemdata = itemData.problem_description || itemData.video_name
		if(!itemdata) {
			handleAdd()
		}
		else {
			dispatch({
				type: 'upload/changeModalState',
				modalState: !modalState
			})
		}
	}
	// const handleChangeOk = () =>{
	// 	dispatch({
	// 		type: 'upload/changeModalState',
	// 		modalState: !modalState
	// 	})
	// }
	const handleAdd = ()=>{
		if (isSelectMenuItem == '1' ) {
			if(tmpFile.length <= 0){
				message.error('请上传文件')
				return;
			}
			validateFields([
				`title-Course-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`,
				`detail-Course-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`,
				],(errors, values)=>{
					if(errors){
						return ;
					}

					dispatch({
						type: 'upload/multiplyPlusUploadList',
						uploadList: [
						...uploadList,
						{ 
							file: tmpFile, 
							// progress: uploadListProgress[tmpFile[0].preview] || 100,// 进度
							video_name: getFieldValue(`title-Course-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`),
							video_description: getFieldValue(`detail-Course-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`),
							source_url: getFieldValue(`file-Course-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`),
							author_id: loginUserList.user_id,
							course_id: isSelectContext.id,
						}]
					})
					dispatch({
						type: 'upload/tmpPlus',
						tmpFile: []
					})
					dispatch({
						type: 'upload/changeTime',
					})
					dispatch({
						type: 'upload/changeModalState',
						modalState: false
					})
				})
		};
		if (isSelectMenuItem == '3') {
			let list = {}
			validateFields([
				`detail-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`,
				`type-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`,
				`rightAnswer-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`,
				`explain-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`,
				
				],(errors, values)=>{
					if(errors){
						return ;
					}
					if(getFieldValue(`type-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`) == 0){
						validateFields([
							`choice-a-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`,
							`choice-b-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`,
							`choice-c-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`,
							`choice-d-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`,
						],(errors, values)=>{
							if(errors){
								return ;
							}
							list = { 
								...list,
								choice_a: getFieldValue(`choice-a-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`),
								choice_b: getFieldValue(`choice-b-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`),
								choice_c: getFieldValue(`choice-c-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`),
								choice_d: getFieldValue(`choice-d-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`),
							}
						})
					}
					let images = ''
					if(getFieldValue(`file-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`).length > 0){
						getFieldValue(`file-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`).map((value,index) => {
							if(index == getFieldValue(`file-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`).length -1) images += `${value}`
							else images += `${value}:`
						})
					}
					dispatch({
						type: 'upload/multiplyPlusUploadList',
						uploadList: [
						...uploadList,
						{ 
							...list,
							file: uploadListFiles, 
							description_image: images,
							problem_description: getFieldValue(`detail-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`), 
							problem_type: getFieldValue(`type-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`),
							right_answer: getFieldValue(`rightAnswer-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`),
							answer_explain: getFieldValue(`explain-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`),
							author_id: loginUserList.user_id,
							test_id: isSelectContext.id,
						}]
					})
					dispatch({
						type: 'upload/changeTime',
					})
					dispatch({
						type: 'upload/multiplyPlus',
						uploadListFiles: []
					})
					dispatch({
						type: 'upload/changeModalState',
						modalState: false
					})
				})
		}
	}
	const handleChange = (Data,Index)=>{
		// uploaditem 传上来的数据
		dispatch({
			type: 'upload/itemDataPlus',
			itemData: Data,
			itemIndex: Index
		})
		dispatch({
			type: 'upload/changeModalState',
			modalState: !modalState
		})
	}
	const handleSort = (orderList) =>{
		// let newList = {}
		// orderList.map((val,index)=>{
		// 	newList[val] = index
		// })
		// newList['isOrder'] = true
		dispatch({
			type: 'upload/uploadFileOrder',
			order: orderList
		})
	}
	const handleSubmitAll = ()=>{
		if (order.length > 0) {
			order.map((data,index)=>{
				if(isSelectMenuItem == '3'){
					dispatch({
						type: 'upload/post/createProblem',
						test_id: isSelectContext.id,
						body: { ...data, problem_order: index}
					})
				}
				if(isSelectMenuItem == '1'){
					if(!data.file[0].request.xhr.response) {
						message.error('列表有文件未上传完成')
						return ;
					}
					dispatch({
						type: 'upload/post/createVideo',
						course_id: isSelectContext.id,
						body: { ...data, video_order: index}
					})
				}
			})
		}
		else{
			let list = [];
			list = list.concat(isSelectContextList,uploadList)
			if(uploadList.length <= 0) {//先指操作为上传的区域,加入修改api后遍历list
				message.error('列表为空')
				return ;
			}
			uploadList.map((data,index)=>{
				if(isSelectMenuItem == '3'){
					dispatch({
						type: 'upload/post/createProblem',
						test_id: isSelectContext.id,
						body: { 
							problem_description: data.problem_description || '',
							description_image: data.description_image || '',
							problem_type: data.problem_type || '',
							choice_a: data.choice_a || '',
							choice_b: data.choice_b || '',
							choice_c: data.choice_c || '',
							choice_d: data.choice_d || '',
							right_answer: data.right_answer || '',
							answer_explain: data.answer_explain || '',
							author_id: data.author_id,
							test_id: data.test_id,
							problem_order: index
						}
					})
				}
				if(isSelectMenuItem == '1'){
					if(!data.file[0].request.xhr.response) {
						message.error('列表有文件未上传完成')
						return ;
					}
					console.log(data)
					dispatch({
						type: 'upload/post/createVideo',
						course_id: isSelectContext.id,
						body: {
							video_name: data.video_name || '' ,
							video_description: data.video_description || '' ,
							source_url: data.source_url || '' ,
							author_id: data.author_id,
							course_id: data.course_id,
							video_order: index
						}
					})
				}
			})
		}
	}
	const handleChangeModalState = (type) =>{
		if(type == 'new' || type == 'clearitem'){// 新文件
			dispatch({
				type: 'upload/itemDataPlus',
				itemData: {},
				itemIndex: 0
			})
		}
		dispatch({
			type: 'upload/changeModalState',
			modalState: !modalState
		})
	}
	const handleDrop = (file) =>{
		if(isSelectMenuItem == '3'){
			dispatch({
				type: 'upload/multiplyPlus',
				uploadListFiles: uploadListFiles.concat(file)
			})
		}else{
			dispatch({
				type: 'upload/tmpPlus',
				tmpFile: file
			})
		}
		file.uploadPromise = (e) =>{
			console.log(e)// 后期再加上文件上传判断
		}
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
				// if(uploadList.length > 0){
				// 	uploadList.map((data,index)=>{
				// 		let newlist = []
				// 		newlist[index] = { ...data, progress: e.percent}
				// 		dispatch({
				// 			type: 'upload/multiplyPlusUploadList',
				// 			uploadList: newlist
				// 		})
				// 	})
				// }
			}
		})
	}

	const videoValue = () =>{
		if (itemData.source_url) return itemData.source_url;
		if (tmpFile.length > 0){
			if (tmpFile[0].request.xhr.response) return JSON.parse(tmpFile[0].request.xhr.response).key;
		}
	}

	const testImageValue = () =>{
		let filelist = [];
		if(itemData.description_image) {
			itemData.description_image.split(':').map((filename,index)=>{
				filelist = [ ...filelist, filename]
			})
		}
		if(uploadListFiles.length > 0 ){
			uploadListFiles.map((file,index)=>{
				if(file.request.xhr.response) filelist = [ ...filelist, `${JSON.parse(file.request.xhr.response).key}`]
			})
		}
		return filelist;
	}


	// --------render-------------------------
	const renderUploadText = () =>{
			if(itemData.video_name) return <div>{itemData.video_name}</div>
			if(tmpFile.length <= 0 ){
				return (
					<div>
						<Icon type='plus' />
						<div>点击上传文件</div>
					</div>
				)
			}
			if(tmpFile.length > 0 ){
				if(!tmpFile[0].request.xhr.response) return <Progress percent={uploadListProgress[tmpFile[0].preview].toFixed(0)} strokeWidth={5} status="active" />
				else return <div>{tmpFile[0].name}</div>
			}
		
	}


	const renderTestImange = () =>{
		if (itemData.description_image) {
			return itemData.description_image.split(':').map((filename,index)=>{
				return(
					<div className={styles.preview} key={index} style={{ backgroundImage: `url(${config.qiniu}/${filename})`}}>
					</div>
				)
			})
		};
		if(uploadListFiles.length > 0) {
			 return uploadListFiles.map((data,index) => {
				return(
					<div className={styles.preview} key={index} style={{ backgroundImage: `url(${data.preview})`}}>
					</div>
				)
			})
		}
	}
	const renderUploadItem = () =>{
		let list = [];
		list = list.concat(uploadList,isSelectContextList)
		if(list.length <= 0) return <div>点击左下添加内容吧</div>;
		else{
			// if(order.isOrder == true){
			// 	let newlist = []
			// 	for(let val in order){
			// 		if(val == 'isOrder') break;
			// 		const match = pathToRegexp(':name-:level').exec(val)
			// 		newlist = [ ...newlist, list[match[2]] ]
			// 	}
			// 	return newlist.map((data,index) => {
			// 		let orderlist = Object.getOwnPropertyNames(order)//
			// 		return(
			// 			<SortItem className='dynamic-item' sortData={`${orderlist[index]}`} key={index} >
			// 			<UploadItem data={data} form={form} onChange={handleChange} index={index}/>
			// 			</SortItem>
			// 		)
			// 	})

			// }
			if(order.length > 0 ){
				return order.map((data,index)=>{
					return(
					<SortItem className='dynamic-item' sortData={data} key={index} >
					<UploadItem data={data} form={form} onChange={handleChange} index={index}/>
					</SortItem>
					)
				})
			}
			return list.map((data,index) => {
				// console.log(data.file[0])
				//  data有两种可能，一是原有一存在的视频，二是刚上传的东西【测试不存在视频】id表示已存在，其他名称为未存在
				// 测试有另一种可能，
				// 刚上传的东西 包含 { file:[], "video_name", "video_description"}//视频
				// {file:[],problem_description, problem_type, "choice_a": 3.12,      // 选项a的内容，下面类推"choice_b":12,"choice_c":13,"choice_d":14, }
				return(
					// <SortItem className='dynamic-item' sortData={`${data.problem_description || data.id || data.file[0].preview}-${index}`} key={index} >
					// <UploadItem data={data} form={form} onChange={handleChange} index={index}/>
					// </SortItem>
					<SortItem className='dynamic-item' sortData={data} key={index} >
					<UploadItem data={data} form={form} onChange={handleChange} index={index}/>
					</SortItem>
				)
			})
		}
	}
	const renderCourse = ()=>{
		return(
			<Modal title="添加视频" 
			width={900}
			visible={modalState} 
			onOk={isChangeorAdd.bind(this)} onCancel={handleChangeModalState.bind(this,'clearitem')}
			>
			<Form>
			<Row>
				<Col span={8}>
				<Form.Item 
				help="仅限视频格式"
				>
					<a>
				<Qiniu 
					onDrop={handleDrop} 
					accept='video/*'
					size={150} 
					style={{border: '0'}}
					token={token} 
					multiple={false}
					onUpload={handleUpload}>
					<div className={styles.preview} style={{ width: '100%'}}>
						{ renderUploadText() }
						
					</div>
				</Qiniu>
				</a>
				<Input type='text' 
				{...getFieldProps(`file-Course-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
						initialValue: videoValue(),
						// initialValue: ()=>{ 
						// 	if(tmpFile[0]) return tmpFile[0].preview;
						// 	else return null
						// },
						rules: [
							{ required: true },
						],
				})} style={{display: 'none'}} />
				</Form.Item>
				</Col>
				<Col span={15}>
				
				<div>
					<Form.Item
					{...formItemLayout}
					label='标题'
					
					>
						<Input {...getFieldProps(`title-Course-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
							initialValue: itemData.video_name || null,
							rules: [
								{ required: true, min: 1, max: 15, message: ['至少为 2 个字符','最多为 15 个字符'] },
							],
						})} type="text" />
					</Form.Item>
					<Form.Item
					{...formItemLayout}
					label='描述'
					
					>
						<Input {...getFieldProps(`detail-Course-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
							initialValue: itemData.video_description || null,
							rules: [
								{ required: true, min: 1, max: 300, message: ['至少为 2 个字符','最多为 300 个字符'] },
							],
						})} type="textarea" rows={6}/>
					</Form.Item>
				</div>
				
				</Col>
			</Row>
			</Form>
		</Modal>
		)
	}
	// ------test-form-----
	const renderTestChoice = ()=>{
		return(
			<div>
			<Form.Item
			{...formItemLayout}
			label='选项A'
			>
			<Input type='textarea' rows={3}
					{...getFieldProps(`choice-a-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
						initialValue: itemData.chioce_a || null,
						rules: [
							{ required: true, min: 1, max: 1000, message: ['至少为 2 个字符','最多为 1000 个字符'] },
						],
					})}
				/>
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label='选项B'
			>
			<Input type='textarea' rows={3}
					{...getFieldProps(`choice-b-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
						initialValue: itemData.chioce_b || null,
						rules: [
							{ required: true, min: 1, max: 1000, message: ['至少为 2 个字符','最多为 1000 个字符'] },
						],
					})}
				/>
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label='选项C'
			>
			<Input type='textarea' rows={3}
					{...getFieldProps(`choice-c-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
						initialValue: itemData.chioce_c || null,
						rules: [
							{ required: true, min: 1, max: 1000, message: ['至少为 2 个字符','最多为 1000 个字符'] },
						],
					})}
				/>
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label='选项D'
			>
			<Input type='textarea' rows={3}
					{...getFieldProps(`choice-d-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
						initialValue: itemData.chioce_d || null,
						rules: [
							{ required: true, min: 1, max: 1000, message: ['至少为 2 个字符','最多为 1000 个字符'] },
						],
					})}
				/>
			</Form.Item>
			</div>
		)
		
	}
	const renderTest = ()=>{
		return(
			<Modal title="添加问题" 
			width={900}
			visible={modalState} 
			onOk={isChangeorAdd.bind(this)} onCancel={handleChangeModalState.bind(this,'clearitem')}
			>
			<Form>
			<Row>
			<Form.Item>
				<Input type='textarea' rows={6} placeholder="添加问题题目，请不用给题目加上序号" 
					{...getFieldProps(`detail-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
						initialValue: itemData.problem_description || null,
						rules: [
							{ required: true, min: 1, max: 1000, message: ['至少为 2 个字符','最多为 1000 个字符'] },
						],
					})}
				/>
			</Form.Item>
			<Form.Item>
				<Radio.Group label='请选择题目类型' 
				{...getFieldProps(`type-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
					initialValue: itemData.problem_type || 0,
					rules: [
						{ required: true, message: '请选择您的性别', type: 'number' },
					],
				})}>
					<Radio value={0}>选择题</Radio>
					<Radio value={1}>主观题</Radio>
				</Radio.Group>
			</Form.Item>

			{ getFieldValue(`type-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`) == 0? renderTestChoice() : null }

			<Form.Item
			{...formItemLayout}
			label='正确答案'
			>
				<Input type='text'
					{...getFieldProps(`rightAnswer-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
						initialValue: itemData.answer_explain || null,
						rules: [
							{ required: true, min: 1, max: 1000, message: ['至少为 2 个字符','最多为 1000 个字符'] },
						],
					})}
				/>
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label='正确答案的解释'
			>
				<Input type='textarea' rows={3}
					{...getFieldProps(`explain-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
						initialValue: itemData.right_answer || null,
						rules: [
							{ required: true, min: 1, max: 1000, message: ['至少为 2 个字符','最多为 1000 个字符'] },
						],
					})}
				/>
			</Form.Item>
			<Form.Item>
				<Select tags
				{...getFieldProps(`file-Test-${itemData.id || itemData.problem_description || itemData.video_name || time}-${itemIndex}`, {
						initialValue: testImageValue(),
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
							<div>点击为题目上传图片</div>
						</div>
					</div>
				</Qiniu>
				{ renderTestImange() }
			</Form.Item>
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
		{ renderUploadItem() }
		</Sortable>
		</div>
		<Button type='ghost' onClick={handleChangeModalState.bind(this,'new')}>添加</Button>
		<Button type='ghost' onClick={handleSubmitAll.bind(this)}>保存列表</Button>
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