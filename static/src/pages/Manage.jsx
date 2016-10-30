import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Icon, Tabs, Menu, Pagination, Modal } from 'antd';
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

const Manage = ({ upload, user, dispatch, location }) => {
	const { loginUserList } = user
	const { files, token, modalState, progress, isSelectMenuItem, isEdit } = upload

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
	}

	const handleChangeEditState = () =>{
		dispatch({
			type: 'upload/changeEditState',
			isEdit: !isEdit
		})
	}

	const handleChangeModalState = () =>{
		dispatch({
			type: 'upload/changeModalState',
			modalState: !modalState
		})
	}
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

	const renderIsEdit = ()=>{
		return isEdit ? [
		<div className={styles.relative} key='2'>
		<EditPannel onBackClick={handleChangeEditState.bind(this)}/>
		</div> ] : [
		<div className={styles.relative} key='1'>
		<div style={{minHeight: "500px"}}>
			<UploadButton 
						type={isSelectMenuItem}
						token={token}
						files={files}
						qiniuUrl={config.qiniu}
						modalState={modalState}
						onButtonClick={handleChangeModalState.bind(this)}
						onCancel={handleChangeModalState.bind(this)}
						onDrop={handleDrop.bind(this)} 
						onUpload={handleUpload.bind(this)}
						onSubmit={handleSubmit.bind(this)}
			/>

		<ManageCover onClickEdit={handleChangeEditState.bind(this)}/>
		</div>

		<Pagination 
		/*onChange={handleChangePagination.bind(this)} 
		total={total} current={isSelectPagination} 
		pageSize={12} 
		defaultPageSize={12} */
		/>
		</div>]
	}

	return (
		<Layout location={location}>
			<CommentContext title="稿件管理中心">
				<Row gutter={16}>
					<Col span={4}>
						<Menu onClick={handleChangeMenuItem.bind(this)}
						style={{ width: '100%' }}
						defaultOpenKeys={['sub1']}
						selectedKeys={[isSelectMenuItem]}
						mode="inline"
					  >
						<Menu.SubMenu key="sub1" title={<span><Icon type="mail" /><span>稿件资料</span></span>}>
							<Menu.Item key="1">课程视频管理</Menu.Item>
							<Menu.Item key="2">文本资料管理</Menu.Item>
							<Menu.Item key="3">试题测验管理</Menu.Item>
						</Menu.SubMenu>
						<Menu.SubMenu key="sub2" title={<span><Icon type="appstore" /><span>评论管理</span></span>}>
							<Menu.Item key="5">课程视频</Menu.Item>
							<Menu.Item key="6">文本资料</Menu.Item>
							<Menu.Item key="7">试题测验</Menu.Item>
						</Menu.SubMenu>
					  </Menu>
					</Col>
					<Col span={16} offset={2}>
					<div className={styles.margin}>

					</div>
						<QueueAnim
						type={['right','left']} 
						ease={['easeOutQuart', 'easeInOutQuart']}
						>
						{ renderIsEdit() }
						</QueueAnim>
					
					</Col>
				</Row>
			</CommentContext>
		</Layout>
	);
};

Manage.PropTypes = {

};

function mapStateToProp({ upload, user }){
	return{
		upload: upload,
		user: user
	};
}

export default connect(mapStateToProp)(Manage);