import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Icon, Tabs, Menu, Pagination, Modal, Spin, Form, Input, Select, Button } from 'antd';

import InfoItem from '../components/Widget/InfoItem/InfoItem';
import BackStageLayout from '../layouts/BackStageLayout/BackStageLayout';
import QueueAnim from 'rc-queue-anim';


import styles from './commont.less';
import config from '../config/config.js'

// 后台可以分配权限，删除,修改资料
let Backstage = ({ upload, backstage, user, form, dispatch}) =>{
	const { isSelectContext, modalState, list, loading, isSelectMenuItem, isSelectPagination, isSelectCategory, keyWord, count } = backstage
	const { validateFields, getFieldProps, getFieldValue } = form;
	// -----------action---------------
	const handleGetData = ()=>{
		if(isSelectMenuItem == '7' && keyWord == ''){
			dispatch({
				type: 'backstage/get/List',
				context: 'user',
				pagination: 1,
			})
		}
		// 其他分类搜索有分页，到时记得判断
	}
	const handleChangePagination = (page)=>{
		dispatch({
			type: 'backstage/changePagination',
			isSelectPagination: page
		})
		handleGetData()
	}
	const handleToggleModal =()=>{
		dispatch({
			type: 'backstage/toggleModal',
			modalState: !modalState
		})
	}
	const handleSelectContext = (item)=>{
		dispatch({
			type: 'backstage/changeSelectContext',
			isSelectContext: item
		})
		handleToggleModal()
	}
	const handleSearch = ()=>{
		validateFields(['search'],(errors, values)=>{
			if(errors) return;
			if(isSelectMenuItem == '7'){
				dispatch({
					type: 'backstage/search/List',
					context: 'user',
					keyword: getFieldValue('search')
				})
				return;
			}
			// 补全---《记得这里其他分类！！！！！的搜索请求，以及修改在server和saga的存储方法
			dispatch({
				type: 'backstage/search/List',
				context: '',
				body: {
					key_word: getFieldValue('search')
				}
			})
		})
		
	}
	const handleAssignUser = ()=>{
		validateFields(['user_role'],(errors, values)=>{
			if(errors) return;
			dispatch({
				type: 'backstage/control/List',
				context: 'user',
				body:{
					uid: isSelectContext.user_id,
					role_id: getFieldValue('user_role')
				}
			})
		})
		
	}
	// -----------form rule------------
	const searchRule = getFieldProps(`search`, {
		rules: [{ required: true, message: '不能为空' }],
		})
	// -----------render---------------
	const renderMenu = () =>{
		return(
			<Menu 	
				/*onClick={handleChangeMenuItem.bind(this)}*/
				style={{ width: '100%', backgroundColor: 'transparent', borderRight: 0 }}
				defaultOpenKeys={['sub3']}
				selectedKeys={[isSelectMenuItem]}
				mode="inline"
				>
					<Menu.SubMenu key="sub1" title={<span><Icon type="mail" /><span>稿件管理</span></span>}>
						<Menu.Item key="1">课程视频管理</Menu.Item>
						<Menu.Item key="2">文本资料管理</Menu.Item>
						<Menu.Item key="3">试题测验管理</Menu.Item>
					</Menu.SubMenu>
					<Menu.SubMenu key="sub2" title={<span><Icon type="appstore" /><span>交流区管理</span></span>}>
						<Menu.Item key="5">帖子管理</Menu.Item>
						<Menu.Item key="6" >回复管理</Menu.Item>
					</Menu.SubMenu>
					<Menu.SubMenu key="sub3" title={<span><Icon type="appstore" /><span>用户管理</span></span>}>
						<Menu.Item key="7">权限分配管理</Menu.Item>
					</Menu.SubMenu>
			</Menu>
		)
	}
	const renderList = ()=>{
		if(list.length <= 0) return
		return list.map((data,index)=>{
			if(isSelectMenuItem == '7') return <InfoItem key={index} type='user' data={data} onAssign={handleSelectContext}/>
		})

	}
	const renderUser = ()=>{
		return <div style={{ height: '100%'}} key='7'>
		<Spin spinning={loading} >
		<Row>
		<Col span={6}>
		<Button onClick={handleGetData}>显示全部</Button>
		</Col>

		<Col span={6} offset={12}>
		<Form>
		<Form.Item 
		labelCol={{ span:1 }}
      	wrapperCol={{ span:23 }}>
		<Input.Group className="ant-search-input-wrapper">
			<Input onPressEnter={handleSearch}
		{...searchRule} placeholder="请输入需要搜索的用户名" />
		<div className="ant-input-group-wrap">
			<Button icon="search" onClick={handleSearch} />
		</div>
		</Input.Group>
		</Form.Item>
		</Form>
		</Col>
		
		</Row>
		<div className={styles.block} >
		<Row gutter={16}>
		<Col span={4}>id</Col>
		<Col span={4}>用户名</Col>
		<Col span={4}>昵称</Col>
		<Col span={4}>邮箱</Col>
		<Col span={4}>身份</Col>
		<Col span={4}>操作</Col>
		</Row>
		</div>
		{ renderList() }
		{ renderUserModal() }
		</Spin>
		<Pagination 
			onChange={handleChangePagination} 
			total={count}
			pageSize={12} 
			defaultPageSize={12} 
		/>
		</div>
	}
	const renderContext = ()=>{
		if(isSelectMenuItem == '7') return renderUser()
	}
	const renderContextPage = ()=>{
		return(
			<QueueAnim>
				{renderContext()}
			</QueueAnim>
		)
	}
	const renderUserModal = ()=>{
		return <Modal 
		title='为该用户分配权限' 
		visible={modalState} 
		onOk={handleAssignUser}
		onCancel={()=>{
			dispatch({
				type: 'backstage/toggleModal',
				modalState: false
			})
			dispatch({
				type: 'backstage/changeSelectContext',
				isSelectContext: {}
			})
		}}>
			<Select {...getFieldProps(`user_role`, {
				rules: [
				{ required: true, message: '请选择', type: 'number'},
				],
				})} placeholder="请选择" style={{ width: '150px' }}>
				<Select.Option value={4}>学生</Select.Option>
				<Select.Option value={3}>教师</Select.Option>
				<Select.Option value={2}>校管理员</Select.Option>
				<Select.Option value={1}>系统管理员</Select.Option>
				<Select.Option value={5}>访客</Select.Option>
			</Select>
		</Modal>
	}
	return(
		<div className={styles.backstage}>
		<BackStageLayout menu={renderMenu()} context={renderContextPage()}/>
		</div>
	)
}
Backstage = Form.create()(Backstage)

function mapStateToProp({ upload, backstage, user }){
	return{
		upload: upload,
		backstage: backstage,
		user: user
	};
}

export default connect(mapStateToProp)(Backstage)