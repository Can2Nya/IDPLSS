import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import classNames from 'classnames';
// import pathToRegexp from 'path-to-regexp';
import videojs from 'video.js/dist/video.min.js';
import Layout from '../layouts/Layout/Layout';

import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import TimeLine from '../components/TimeLine/TimeLine';
import ContextTitle from '../components/ContextTitle/ContextTitle';
import UserLittleInfo from '../components/UserLittleInfo/UserLittleInfo';

import config from '../config/config.js'
import styles from './commont.less';
import 'video.js/dist/video-js.min.css';

const PlayVideo = ({ video, dispatch, location }) =>{
	const { isSelectContext } = video
	const { context } = isSelectContext.isSelectContext

	// ----------------render----------------------------
	// const isAllowVideo = () =>{
	// 	if(isSelectContext.list.length <= 0){
	// 		browserHistory.push(`/detail/video/${isSelectContext.id}/#!/series/1/`)
	// 	}
	// }
	const renderVideoList = ()=>{
		return isSelectContext.list.map((data,index)=>{
			if(!data.show) return;
			return <TimeLine data={data} key={index} onChangeVideo={handleChangeVideo} />
		})
	}
	const videoCls = classNames({
		'video-js': true,
		'vjs-default-skin': true,
		[styles.video]: true,
	})
	// -------------action-----------------------------
	const handleChangeVideo = (id) =>{
		// dispatch({
		// 	type: 'video/changeVideo',
		// 	isSelectVideo: id,
		// })
	}
	return(
		<Layout location={location}>
		
		<div className={styles.playVideo}>

		<div className={styles.contain}>
		<div className={styles.margin}>

		<Row type='flex' align='top'>
		<Col span={18}>
			<ContextTitle data={video} location={location} type='video'/>
		</Col>
		<Col span={6}>
			<UserLittleInfo data={isSelectContext.context} />
		</Col>

		</Row>
		</div>
		</div>

		<div className={styles.videoBlock}>
		<div className={styles.contain}>
		<Row type='flex' justify='center'>

			<VideoPlayer url={`${config.qiniu}/${context.source_url}`} />
			
		</Row>
		</div>
		</div>

		<div className={styles.contain}>
		<Row>
		<Col span={12}>
		<div className={styles.detail}>
		<div className={styles.title}>
		{ isSelectContext.context.course_name }
		</div>
		<p>{ isSelectContext.context.description }</p>
		</div>
		</Col>
		<Col span={12}>
		<div className={styles.displayVideoList}>
		{ renderVideoList() }
		</div>
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