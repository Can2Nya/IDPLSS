import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Col, Icon, Tabs, Spin } from 'antd';
import classNames from 'classnames';
// import pathToRegexp from 'path-to-regexp';
import videojs from 'video.js/dist/video.min.js';
import Layout from '../layouts/Layout/Layout';

import styles from './commont.less';
import 'video.js/dist/video-js.min.css';

const PlayVideo = ({ video, dispatch, location }) =>{
	const videoCls = classNames({
		'video-js': true,
		'vjs-default-skin': true
	})
	const renderVideo = () =>{
		const play = videojs('videoPlay')
		play.play();
	}
	// const renderVideo = videojs('videoPlay');
	// renderVideo.play();
	return(
		<Layout location={location}>
		<div className={styles.playVideo+' '+styles.contain}>
		<Row>
		</Row>
		<Row>
		<Col span={20} >
			<video id='videoPlay' className={videoCls} onClick={renderVideo.bind(this)} controls>
				<source src='http://cn-jxnc-dx-v-02.acgvideo.com/vg6/d/6e/10715538-1.flv?expires=1476104400&ssig=JMgje0IxgwgUkBMMsjnGbw&oi=3060534227&rate=0' />
			</video>
		</Col>
		</Row>
		<Row>
		</Row>
		</div>
		</Layout>
	)
}

PlayVideo.PropTypes = {

};

function mapStateToProp({ video }){
	return{
		video: video,
	}
}

export default connect(mapStateToProp)(PlayVideo);