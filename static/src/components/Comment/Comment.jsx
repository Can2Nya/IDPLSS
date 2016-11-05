import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import classNames from 'classnames';

import styles from './Comment.less';
import config from '../../config/config.js'

const Comment = ({ user, data, onDelete }) => {
	// user={authorid,loginid,logintype}
	const renderUserAvatar = ()=> {
		if(data['author_avatar']) return <Link to={{pathname: `/user/${data.author_id}/`, hash: '#!/dynamic/0/' }} ><div className={styles.avatar} style={{ backgroundImage: `url(${config.qiniu}/${data.author_avatar})`}}></div></Link>
		else return <div className={styles.avatar}></div>
	}
	const renderDeleteButton = () =>{
		if ((user.loginid == user.authorid) || (user.logintype >= 3) || (user.loginid == data['author_id'])){
			return <a onClick={onDelete.bind(this, data['comment_id'], data['author_id'])}><span>&#xe602; 删除</span></a>
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
					<a><span>&#xe60b; 点赞</span></a>
					</div>
				</div>
			</div>
		</div>
	);
};

Comment.propTypes = {  
	
};

export default Comment;