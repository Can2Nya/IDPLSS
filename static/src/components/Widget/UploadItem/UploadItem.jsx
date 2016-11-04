import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Icon, Form, Modal } from 'antd';
import classNames from 'classnames';

// import config from '../../config/config.js';
import styles from './UploadItem.less';

let UploadItem = ({ upload, user, dispatch, data }) => {
	// data为editpannel传入的数据【不然咱自己有要遍历列表
	const { loginUserList, userZoneList, total } = user
	const { uploadListProgress, uploadListFiles, token, modalState, progress, isSelectMenuItem } = upload
	// -----------form rule-----------------
	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};
	// ------------action-------------------
	const handleChangeModalState = () =>{
		dispatch({
			type: 'upload/changeModalState',
			modalState: !modalState
		})
	}
	const fileValue = () =>{
		if(files.length <= 0 || !files[0].request.xhr.response) return '${data.source_url}';
		else return `${JSON.parse(files[0].request.xhr.response).key}`
	}
	const handleDrop = (file) =>{
		dispatch({
			type: 'upload/multiplyPlus',
			uploadListFiles: file
		})
	}
	const handleUpload = () =>{
		let progresses = {};
		uploadListFiles.map((f) =>{
			f.onprogress = (e) =>{
				progresses[f.preview] = e.percent
				dispatch({
					type: 'upload/setMultiplyProgress',
					uploadListProgress: progresses
				})
			}
		})
	}
	const renderUploadText = () =>{
		if(data.id){
			return (
				<div>
					<Icon type='plus' />
					<div>点击上传文件</div>
				</div>
			)
		}
		else{
			if(!data.request.xhr.response) return <Progress percent={progress[files[0].preview].toFixed(0)} strokeWidth={5} status="active" />
			else return <div>{data.name}</div>
		}
	}
	// ------------render-------------------
	const renderForm = (formType)=>{
		return(
			<div>
			<Form.Item
			{...formItemLayout}
			label='标题'
			hasFeedback
			>
				<Input {...getFieldProps(`title-${formType}-${data.id}`, {
					initialValue: data.video_name || data.course_name || null,
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
				<Input {...getFieldProps(`detail-${formType}-${data.id}`, {
					initialValue: isSelectContext.video_description || isSelectContext.test_description || null,
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
		onOk={handlePreSubmitData.bind(this,"Course")} onCancel={onCancel}
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
			{...getFieldProps('file-Course-${data.id}', {
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
		)
	}
	const renderTest = ()=>{
		return(
			<Modal title="添加视频" 
		width={700}
		visible={modalState} 
		onOk={handlePreSubmitData.bind(this,"Test")} onCancel={onCancel}
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
			{...getFieldProps('file-Test-${data.id}', {
					initialValue: fileValue(),
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
	return (
		<div style={{position: 'relative'}}>
		<div className={styles.block}>
		<Row type='flex' align='middle'>
		<Col span={22}>
		<div className={styles.title}>
		{ data['video_name'] || data['test_title'] }
		</div>
		</Col>
		<Col span={2}>
		<a onClick={handleChangeModalState.bind()}>
		<Icon type="edit" />
		</a>
		<a onClick={handleChangeModalState.bind()}>
		<Icon type="edit" />
		</a>
		</Col>
		</Row>
		

		</div>
		<div className={styles.progress} style={{ width:`${uploadListProgress[data.file[0].preview].toFixed(0)}%`}}></div>
		<div className={styles.progressBg}></div>
		</div>
	);
};

UploadItem.propTypes = {  
	
};

function mapStateToProp({ upload, user }){
	return{
		upload: upload,
		user: user
	};
}

export default connect(mapStateToProp)(UploadItem);