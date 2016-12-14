import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Icon, Tabs, Menu, Pagination, Modal, Spin } from 'antd';
import QueueAnim from 'rc-queue-anim';
import merged from 'obj-merged'

import Layout from '../layouts/Layout/Layout';
import CommentContext from '../layouts/CommentContext/CommentContext';
import EditPannel from '../layouts/EditPannel/EditPannel';

import Title from '../components/Title/Title';
import List from '../components/List/List';
import Comment from '../components/Comment/Comment';
import ManageCover from '../components/Widget/ManageCover/ManageCover';
import UploadButton from '../components/UploadButton/UploadButton';

import styles from './commont.less';
import config from '../config/config.js'
import { judgeUserRole } from '../tool/tool.js'

const RenderManage = ({ upload, user, dispatch, location }) => {
	const { loginUserList, userZoneList, total } = user
	const { time, files, token, modalState, loading, progress, isSelectMenuItem, isSelectContextId, isEdit } = upload

	// ---------------action-------------------
	// 切换菜单
	const handleChangeMenuItem = (e) =>{
		dispatch({
			type: 'upload/changeMenuItem',
			item: e.key
		})
		// 顺便初始化files
		dispatch({
			type: 'upload/init',
		})
		// let action = 'user/get/user';
		// if(e.key == '1') action += 'Video'
		// if(e.key == '2') action += 'Text'
		// if(e.key == '3') action += 'Test'
		// dispatch({
		// 	type: action,
		// 	pagination: 1
		// })
		dispatch({
			type: 'upload/changeEditState',
			isEdit: false,
		})
		dispatch({
			type: 'upload/multiplyPlus',
			uploadListFiles: []
		})
		dispatch({
			type: 'upload/multiplyPlusUploadList',
			uploadList: []
		})
		browserHistory.push(`/manage/#!/${e.key}/`)
	}

	const handleChangeEditState = (id) =>{
		let action = 'upload/get/user';
		if(isSelectMenuItem == '1') {
			action += 'Video'
			dispatch({
				type:'upload/get/userVideoList',
				id: id
			})
		}
		if(isSelectMenuItem == '2') action += 'Text'
		if(isSelectMenuItem == '3') {
			action += 'Test'
			dispatch({
				type:'upload/get/userTestList',
				id: id
			})
		}
		dispatch({
			type: action,
			id: id
		})
		// 该action以在saga处理，具体见user-saga
		// dispatch({
		// 	type: 'upload/changeEditState',
		// 	isEdit: !isEdit,
		// 	isSelectContextId: id
		// })
		
	}
	const handleDelete = (id) =>{
		let action = 'upload/del/create';
		if(isSelectMenuItem == '1') action += 'Course'
		if(isSelectMenuItem == '2') action += 'Text'
		if(isSelectMenuItem == '3') action += 'Test'
		Modal.confirm({
			title: '确认是否删除',
			content: '该操作无法恢复',
			okText: '删除',
			cancelText: '取消',
			onOk: (onOk) =>{
				dispatch({
					type: action,
					id: id
				})
				onOk()
			},
			onCancel: (e)=>{
				e()
			}
		})
	}

	const handleChangeModalState = () =>{
		dispatch({
			type: 'upload/changeModalState',
			modalState: !modalState
		})
	}
	const handleChangePagination = (page) =>{
		let action = 'user/get/user';
		if(isSelectMenuItem == '1') action += 'Video'
		if(isSelectMenuItem == '2') action += 'Text'
		if(isSelectMenuItem == '3') action += 'Test'
		dispatch({
			type: action,
			pagination: page
		})
	}

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
		body = merged(body,{ author_id: loginUserList.user_id })
		if (isSelectMenuItem == '1') {
			dispatch({
				type: 'upload/post/createCourse',
				body: body
			})
		}
		if (isSelectMenuItem == '2') {
			dispatch({
				type: 'upload/post/createText',
				body: body
			})
		}
		if (isSelectMenuItem == '3') {
			dispatch({
				type: 'upload/post/createTest',
				body: body
			})
		}
		dispatch({
			type: 'upload/changeTime',
		})
		dispatch({
			type: 'upload/drop',
			files: []
		})
	}
	// --------------render-------------------

	// const renderList = () =>{
	// 	<div className={styles.absolute} key='1'>
	// 	<div style={{minHeight: "700px"}}>

	// 	<ManageCover onClickEdit={handleChangeEditState.bind(this)}/>
	// 	</div>

	// 	<Pagination 
	// 	/*onChange={handleChangePagination.bind(this)} 
	// 	total={total} current={isSelectPagination} 
	// 	pageSize={12} 
	// 	defaultPageSize={12} */
	// 	/>
	// 	</div>
	// }

	// const renderEdit = ()=>{
	// 	<div className={styles.absolute} key='2'>
	// 	<EditPannel />
	// 	</div>
	// }
	const renderList = () =>{
		if(userZoneList.length <= 0 || !userZoneList){
			return <div>暂时还未有内容</div>;
		}
		return userZoneList.map((data,index) =>{
			if(!data.show) return
			return (
				<ManageCover type={isSelectMenuItem} key={index} data={data} onClickEdit={handleChangeEditState.bind(this)}  onDelete={handleDelete.bind(this)}/>
			)
		})
	}

	const renderIsEdit = ()=>{
		return isEdit ? [
		<div className={styles.page} key='2'>
		<div className={styles.displayBlock}>
		<EditPannel onBackClick={handleChangeEditState.bind(this)}/>
		</div>
		</div> ] : [
		<div className={styles.page} key='1'>
		<div className={styles.displayBlock}>
			<UploadButton 
						time={time}
						type={isSelectMenuItem}
						token={token}
						files={files}
						qiniuUrl={config.qiniu}
						modalState={modalState}
						progress={progress}
						onButtonClick={handleChangeModalState.bind(this)}
						onCancel={handleChangeModalState.bind(this)}
						onDrop={handleDrop.bind(this)} 
						onUpload={handleUpload.bind(this)}
						onSubmit={handleSubmit.bind(this)}
			/>
			{ renderList() }
		
		</div>

		<Pagination 
		onChange={handleChangePagination.bind(this)} 
		total={total}
		pageSize={12} 
		defaultPageSize={12}
		/>
		</div>]
	}

	return (
		<Layout location={location}>
			<CommentContext title="资源管理中心">
				<Row gutter={16}>
					<Col span={4}>
						<Menu onClick={handleChangeMenuItem.bind(this)}
						style={{ width: '100%' }}
						defaultOpenKeys={['sub1']}
						selectedKeys={[isSelectMenuItem]}
						mode="inline"
					  >
						<Menu.SubMenu key="sub1" title={<span><Icon type="mail" /><span>稿件资料</span></span>}>
							{ judgeUserRole.isAllowCommitCourseOrTest(loginUserList.role_id)? [
								<Menu.Item key="1">课程视频管理</Menu.Item>,
								<Menu.Item key="2">文本资料管理</Menu.Item>,
								<Menu.Item key="3">试题测验管理</Menu.Item>,
								] : (
									<Menu.Item key="2">文本资料管理</Menu.Item>
								)}
							
						</Menu.SubMenu>
						{/*<Menu.SubMenu key="sub2" title={<span><Icon type="appstore" /><span>评论管理</span></span>}>
							<Menu.Item key="5">课程视频</Menu.Item>
							<Menu.Item key="6">文本资料</Menu.Item>
							<Menu.Item key="7">试题测验</Menu.Item>
						</Menu.SubMenu>*/}
					  </Menu>
					</Col>
					<Col span={16} offset={2}>
					<Spin spinning={loading}>
					<div className={styles.edit}>
						<QueueAnim
						type={['right','left']} 
						ease={['easeOutQuart', 'easeInOutQuart']}
						>
						{ renderIsEdit() }
						</QueueAnim>
					</div>
					</Spin>
					</Col>
				</Row>
			</CommentContext>
		</Layout>
	);
};

RenderManage.PropTypes = {

};

const Manage = React.createClass({
	// shouldComponentUpdate(nextProps, nextState){
	// 	return nextProps != this.state
	// },
	// forceUpdate(){
	// 	const { loginUserList } = this.props.user
	// 	if(loginUserList.length <= 0 ){
	// 		browserHistory.push(`/index`)
	// 	}
	// },
	// componentDidMount()	{
	// 	const { loginUserList } = this.props.user
	// 	if(loginUserList.length <= 0 ){
	// 		browserHistory.push(`/index`)
	// 	}
	// },
	render(){
		return <RenderManage upload={this.props.upload} user={this.props.user} dispatch={this.props.dispatch} location={this.props.location}/>
	}
})

function mapStateToProp({ upload, user }){
	// const { loginUserList } = user
	// if(loginUserList.length <= 0){
	// 	browserHistory.push('/login/')
	// }
	return{
		upload: upload,
		user: user
	};
}

export default connect(mapStateToProp)(Manage);