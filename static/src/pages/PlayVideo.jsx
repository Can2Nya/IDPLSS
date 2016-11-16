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
	const { isSelectContext, isSelectPagination } = video
	const { isSelectVideo, videoElement } = isSelectContext.isSelectContext

	// ----------------render----------------------------
	const isAllowVideo = () =>{
		if(isSelectContext.list.length <= 0){
			browserHistory.push(`/detail/video/${isSelectContext.id}/#!/series/1/`)
		}
	}
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
		dispatch({
			type: 'video/changeVideo',
			isSelectVideo: id,
		})
		// videoElement.src(`${config.qiniu}/${isSelectContext.list[id].source_url}`)
		// videoElement.reset()
		// videoElement.load()
	}
	// --------------fuc-----------------------------
	// const handleChangeVideoSrc = () =>{
	// 	videoElement.src(`${config.qiniu}/${isSelectContext.list[isSelectVideo].source_url}`)
	// 	videoElement.reset()
	// 	videoElement.load()
	// }

	// // -------------react-----------------------------
	// const Video = React.createClass({
	// 	componentWillMount() {
	// 		console.log(2)
	// 		isAllowVideo();
	// 	},
	// 	componentDidMount()	{
	// 		console.log(1)
	// 		const play = videojs('videoPlay')
	// 		dispatch({
	// 			type: 'video/init/player',
	// 			videoElement: play
	// 		})
	// 		// play.play();
	// 	},
	// 	shouldComponentUpdate(){
	// 		console.log(3)
	// 		return false;
	// 	},
	// 	render() {
	// 		return(
	// 			<video id='videoPlay' className={videoCls} controls preload='auto'>
	// 				<source src={`${config.qiniu}/${isSelectContext.list[isSelectVideo].source_url}`} />
	// 			</video>
	// 		)
	// 	}
	// 	// const play = videojs('videoPlay')
	// 	// play.play();
	// })
	// const renderVideo = videojs('videoPlay');
	// renderVideo.play();
	return(
		<Layout location={location}>
		
		<div className={styles.playVideo}>

		<div className={styles.contain}>
		<div className={styles.margin}>

		<Row type='flex' align='top'>
		<Col span={18}>
			<ContextTitle data={video} location={location} index={isSelectVideo}/>
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

			<VideoPlayer url={`${config.qiniu}/${isSelectContext.list[isSelectVideo].source_url}`} />
			
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