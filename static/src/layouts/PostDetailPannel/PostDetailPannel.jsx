import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Tabs, Icon } from 'antd';
import classNames from 'classnames';


import InputForm from '../../components/InputForm/InputForm';
import Comment from '../../components/Comment/Comment';

import config from '../../config/config.js'
import styles from './PostDetailPannel.less';

const PostDetailPannel = ({ children, user, data, onPostEdit, onPostDel }) => {
	const PostDetailPannelCls = () =>{
		/*var style = {};
		if(type == 'video') style[[styles.video]] = true;
		if(type == 'word') style[[styles.word]] = true;
		if(type == 'ppt') style[[styles.ppt]] = true;
		if(type == 'pdf') style[[styles.pdf]] = true;*/

		return classNames({
			[styles[type]]:true
		});
	};
	const renderImage = () =>{
		if(data.images == '') return;
		else {
			if(data.images) return data.images.split(':').map((image,index)=>{
				return <img key={index} height={200} src={`${config.qiniu}/${image}`} />
			})
		}
	}
	const renderEidtButton = ()=>{
		if ((user.user_id == data.author_id) || (user.user_type >= 3)){
			return <div className={styles.icon}>
			<a onClick={onPostDel}><span>&#xe602;删除</span></a>
			<a onClick={onPostEdit}><span><Icon type="edit" />修改</span></a>
			</div>
		}
	}
	return (
		<div className={styles.pannel}>
		<Row gutter={16}>
		<Col span={5} lg={4}>
			<Link to={{pathname: `/user/${data.author_id}/`, hash: '#!/dynamic/0/' }} ><div className={styles.avatar} style={{backgroundImage: `url(${config.qiniu}/${data.author_avatar})`}}></div></Link>
		</Col>
		<Col span={19} lg={20}>
		<div className={styles.title}>
		{ data.title }
		</div>
		
		<div className={styles.username}>
		<Link to={{pathname: `/user/${data.author_id}/`, hash: '#!/dynamic/0/' }} >{ data.author_name }</Link>
		{ ` at ${data.timestamp}` }
		</div>
		
		<div className={styles.text}>
		<p>{ data.body }</p>
		<div>
			{renderImage()}
		</div>
		</div>
		</Col>
		</Row>
		<div className={styles.tool}>
			{ renderEidtButton() }
		</div>
		{ children }
		</div>
	);
};

PostDetailPannel.propTypes = {  
	
};

export default PostDetailPannel;