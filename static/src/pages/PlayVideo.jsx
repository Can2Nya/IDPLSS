import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import classNames from 'classnames';
// import pathToRegexp from 'path-to-regexp';
import videojs from 'video.js/dist/video.min.js';
import Layout from '../layouts/Layout/Layout';

import VideoTitle from '../components/VideoTitle/VideoTitle';
import UserLittleInfo from '../components/UserLittleInfo/UserLittleInfo';

import styles from './commont.less';
import 'video.js/dist/video-js.min.css';

const PlayVideo = ({ video, dispatch, location }) =>{
	const videoCls = classNames({
		'video-js': true,
		'vjs-default-skin': true,
		[styles.video]: true,
	})
	const RenderVideo = React.createClass({
		componentDidMount()	{
			const play = videojs('videoPlay')
			// play.play();
		},
		render() {
			return(
				<video id='videoPlay' className={videoCls} controls preload='auto'>
					<source src='http://ocaxzmfrd.bkt.clouddn.com/%E5%B8%88%E5%A4%A7+%E5%AE%A3%E4%BC%A0%E8%A7%86%E9%A2%91.mp4' />
				</video>
			)
		}
		// const play = videojs('videoPlay')
		// play.play();
	})
	// const renderVideo = videojs('videoPlay');
	// renderVideo.play();
	return(
		<Layout location={location}>
		<div className={styles.playVideo}>

		<div className={styles.contain}>
		<div className={styles.margin}>

		<Row type='flex' align='top'>
		<Col span={18}>
			<VideoTitle location={location}/>
		</Col>
		<Col span={6}>
			<UserLittleInfo />
		</Col>

		</Row>
		</div>
		</div>

		<div className={styles.videoBlock}>
		<div className={styles.contain}>
		<Row type='flex' justify='center'>

			<RenderVideo />
			
		</Row>
		</div>
		</div>

		<div className={styles.contain}>
		<Row>
		</Row>
		</div>

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