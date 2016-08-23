import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import classNames from 'classnames';
import VideoCover from './VideoCover';

import styles from './VideoCovers.less';

const VideoCovers = () => {
	const renderVideoCover = () =>{
		const sum = [{},{},{},{},{}];
		return (
			sum.map(videocover =><Col lg={6} span={8} className={styles.marginBlock}>
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

/**function mapStateToProp({layout},{location}){
  return {
    layout: filter(layout,location.pathname)
  };
}**/

export default VideoCovers;