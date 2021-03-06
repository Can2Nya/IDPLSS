import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, message } from 'antd';
import classNames from 'classnames';

import styles from './Comment.less';
import config from '../../config/config.js'
import { judgeUserRole } from '../../tool/tool.js'

const Comment = ({ user, data, onDelete }) => {
	// user={authorid,loginid,role}
	const renderUserAvatar = ()=> {
		if(data['author_avatar']) return <Link to={{pathname: `/user/${data.author_id}/`, hash: '#!/dynamic/0/' }} ><div className={styles.avatar} style={{ backgroundImage: `url(${config.qiniu}/${data.author_avatar})`}}></div></Link>
		else return <div className={styles.avatar}></div>
	}
	const renderDeleteButton = () =>{
		if (judgeUserRole.isAllowDeleteComment(user.role, user.loginid, user.authorid)){
			return <a onClick={onDelete.bind(this, data['comment_id'] || data['id'], data['author_id'], data.post_id || null)}><span>&#xe602; 删除</span></a>
		}
	}
	return (
		<div className={styles.comment}>
			<div className={styles.main}>
				<Row>
					<Col span={3} lg={2}>
					{ renderUserAvatar() }
					</Col>
					<Col span={21} lg={22}>
					<Link to={{pathname: `/user/${data.author_id}/`, hash: '#!/dynamic/0/' }} >
					<div className={styles.username}>
					{data['author_name']}
					</div>
					</Link>
					<span>{data['timestamp']}</span>
					<div className={styles.context}>
					<p>
					{ data['body'] }
					</p>
					</div>
					</Col>
				</Row>
				<div className={styles.tool}>
					<div className={styles.icon}>
					{ renderDeleteButton() }
					<a onClick={()=>{
						message.success('收到一个赞！')
					}}><span>&#xe60b; 点赞</span></a>
					</div>
				</div>
			</div>
		</div>
	);
};

Comment.propTypes = {  
	
};

export default Comment;