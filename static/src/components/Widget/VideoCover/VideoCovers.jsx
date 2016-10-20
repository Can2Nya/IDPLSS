import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import classNames from 'classnames';
import VideoCover from './VideoCover';

import styles from './VideoCovers.less';

const VideoCovers = ({ videos, dispatch, mode }) => {
	const { list } = videos;
	const handleToggleMode = (newMode) =>{
		dispatch({
			
		});
	}
	const renderVideoCover = () =>{
		return (
			list.map(video =>
				<Col lg={6} span={8} className={styles.marginBlock} key={video.id}>
				<div >
				<VideoCover type="small" />
				</div>
				</Col>)
		);
	};
	return (
		<Row>
		{renderVideoCover()}
		</Row>
	);
};

VideoCovers.propTypes = {  
	
};

function filter(videos,selectkey){
	console.log(selectkey)
	if (selectkey) {

		const newList = videos.list.filter(video =>{
			if(video.tab === selectkey) return true;
		});
		return { ...videos, list:newList };
	};
	return videos;
}

function mapStateToProp({ videos, menu }){
  return {
    videos: filter(videos,menu.selectkey),
  };
}

export default connect(mapStateToProp)(VideoCovers);