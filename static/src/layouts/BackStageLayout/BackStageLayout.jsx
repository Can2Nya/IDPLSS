import React, { Component, PropTypes } from 'react';

import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Icon, Menu } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars'
import config from '../../config/config.js';

import User from '../../components/Navs/User/User';

import styles from './BackStageLayout.less';

const BackStageLayout = ({ menu, context })=>{
	return(
		<div className={styles.backstagebg}>
			<div className={styles.side}>
				<div className={styles.title}>
					<img style={{verticalAlign:'middle'}} src={config.logo} height='30' /><span>{`  后台管理`}</span>
				</div>
				{ menu }
				{/*<Menu 	
				onClick={handleChangeMenuItem.bind(this)}
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
				</Menu>*/}
			</div>
			<div className={styles.context}>
				<div className={styles.title}>
					<div className={styles.item} style={{ width: '85%'}}>
						<Icon type="book" /> 管理分类标题
					</div>
					<div className={styles.item} style={{ width: '10%', borderRight: '1px solid #eee'}}>
						<Link to='/index'><span style={{color: '#eee'}}><Icon type="enter" /> 返回主站</span></Link>
					</div>
					<div className={styles.item} style={{ width: '5%'}}>
					<User />
					</div>
				</div>
				<div style={{height: '100%'}}>
				<Scrollbars autoHide={true}>
				<div className={styles.page}>
				
				{ context }
				
				</div>
				</Scrollbars>
				</div>
			</div>
		</div>
	)
}

export default BackStageLayout