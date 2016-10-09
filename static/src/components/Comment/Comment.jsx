import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import classNames from 'classnames';

import styles from './Comment.less';

const Comment = ({ user,  onDelete }) => {
	/*const CommentCls = () =>{
		/*var style = {};
		if(type == 'video') style[[styles.video]] = true;
		if(type == 'word') style[[styles.word]] = true;
		if(type == 'ppt') style[[styles.ppt]] = true;
		if(type == 'pdf') style[[styles.pdf]] = true;

		return classNames({
			[styles[type]]:true
		});
	};*/
	const data = {
      "author_id": 1,
      "body": "post comment 5  written by ddragon",
      "comment_id": 5,
      "post_id": 1,
      "show": true,
      "timestamp": "Sat, 24 Sep 2016 04:46:30 GMT"
    }
	return (
		<div className={styles.comment}>
			<div className={styles.main}>
				<Row>
					<Col span={3} lg={2}>
					<div className={styles.avatar}></div>
					</Col>
					<Col span={21} lg={22}>
					<div className={styles.username}>用户名<span>时间</span>
					</div>
					<div className={styles.context}>
					<p>
					xxxxxxxxxxxxx
					</p>
					</div>
					</Col>
				</Row>
				<div className={styles.tool}>
					<div className={styles.icon}>
					<a onClick={onDelete.bind(this, data['post_id'])}><span>&#xe602; 删除</span></a>
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