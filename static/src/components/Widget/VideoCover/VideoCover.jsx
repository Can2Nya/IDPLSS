import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import classNames from 'classnames';
import classNamesBind from 'classnames/bind';

import styles from './VideoCover.less';
import config from '../../../config/config.js'

const VideoCover = ({ type, data, }) => {
	const coverCls = () =>{
		return classNames({
			[styles[type]]:true,
		})
	};
	return (
		<div className={coverCls()}>
			<Link to={{ pathname: `/detail/video/${data.id}/`, hash: '#!/series/1/'}} >
			<div className={styles.img} style={{backgroundImage: `url(${config.qiniu}/${data['images']})`}}>
				<div className={styles.showmun}>
					<span>&#xe60e; </span>
					<span>{ data.like }</span>
				</div>
			</div>
			</Link>
			<Link to={{ pathname: `/detail/video/${data.id}/`, hash: '#!/series/1/'}} >
			<div className={styles.title}>{ data.course_name }</div>
			</Link>
			<Link to={{pathname: `/user/${data.author_id}/`, hash: '#!/dynamic/0/' }} >
			<div className={styles.user}>{ data.author_name }</div>
			</Link>
		</div>
	);
};

VideoCover.propTypes = {  
	
};

export default VideoCover;