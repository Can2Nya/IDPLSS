import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import classNames from 'classnames';
// import pathToRegexp from 'path-to-regexp';
import videojs from 'video.js/dist/video.min.js';
import Layout from '../layouts/Layout/Layout';

import TimeLine from '../components/TimeLine/TimeLine';
import ContextTitle from '../components/ContextTitle/ContextTitle';
import UserLittleInfo from '../components/UserLittleInfo/UserLittleInfo';

import config from '../config/config.js'
import styles from './commont.less';
import 'video.js/dist/video-js.min.css';

const PlayVideo = ({ video, dispatch, location }) =>{
	const { isSelectContext, isSelectPagination } = video
	const { isSelectVideo } = isSelectContext.isSelectContext

	const isAllowVideo = () =>{
		if(isSelectContext.list.length <= 0){
			browserHistory.push(`/detail/video/${isSelectContext.id}/#!/series/1/`)
		}
	}

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
					<source src={`${this.props.url}`} />
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
		{ isAllowVideo() }
		<div className={styles.playVideo}>

		<div className={styles.contain}>
		<div className={styles.margin}>

		<Row type='flex' align='top'>
		<Col span={18}>
			<ContextTitle location={location} data={video}/>
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

			<RenderVideo url={`${config.qiniu}/${isSelectContext.list[isSelectVideo].source_url}`} />
			
		</Row>
		</div>
		</div>

		<div className={styles.contain}>
		<Row>
		<Col span={12}>
		<div className={styles.detail}>
		<div className={styles.title}>
		课程名
		</div>
		<p>miaoshu</p>
		</div>
		</Col>
		<Col span={12}>
		<TimeLine />
		</Col>
		</Row>
		</div>

		</div>
		</Layout>
	)
}

PlayVideo.PropTypes = {

};

function mapStateToProp({ video, user }){
	// const { loginUserList } = user
	// if(loginUserList.length <= 0){
	// 	browserHistory.push('/login/')
	// }
	return{
		video: video,
	}
}

export default connect(mapStateToProp)(PlayVideo);