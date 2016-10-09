import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import classNames from 'classnames';
import classNamesBind from 'classnames/bind';

import styles from './VideoCover.less';

const VideoCover = ({ type, data, }) => {
	const coverCls = () =>{
		return classNames({
			[styles[type]]:true,
		})
	};
	return (
		<div className={coverCls()}>
			<Link to={{ pathname: `/detail/video/${data.id}/`, hash: '#!/series/'}} >
			<div className={styles.img} style={{backgroundImage: `url(${data['images']})`}}>
				<div className={styles.showmun}>
					<span>&#xe60e; </span>
					<span>1111</span>
				</div>
			</div>
			</Link>
			<div className={styles.title}>{ data.course_name }</div>
			<div className={styles.user}>{ data.author_id }</div>
		</div>
	);
};

VideoCover.propTypes = {  
	
};

export default VideoCover;