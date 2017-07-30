import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars'
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
	const { next, id } = isSelectContext
	const { context } = isSelectContext.isSelectContext

	// ----------------render----------------------------
	// const isAllowVideo = () =>{
	// 	if(isSelectContext.list.length <= 0){
	// 		browserHistory.push(`/detail/video/${isSelectContext.id}/#!/series/1/`)
	// 	}
	// }
	const VideoList = React.createClass({
		handleScrollStop(){
			if(this.refs.videoListScrollbar.getScrollHeight() == this.refs.videoListScrollbar.getScrollTop() + this.refs.videoListScrollbar.getClientHeight() && !!next){
				dispatch({
					type: 'video/changePagination',
					isSelectPagination: isSelectPagination+1
				})
				dispatch({
					type: 'video/get/series',
					id: id,
					count: 'part',// 写到这里，记得all
					mode: 'scrollList', 
					pagination: isSelectPagination+1,
				})
			}
		},
		render(){
			return <Scrollbars 
			ref="videoListScrollbar"
			autoHeight={true} 
			autoHide={true} 
			onScrollStop={this.handleScrollStop}>
			<div className={styles.displayVideoList}>
			{ this.props.videoList }
			</div>
			</Scrollbars>
		}
	})
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
		browserHistory.push(`/play/video/${isSelectContext.id}/${id}/`)
	}

	// const handleScrollUpdate = ()=>{
	// 	// console.log(values)
	// 	// const { scrollTop, scrollHeight, clientHeight } = values;
	// 	// console.log(scrollHeight == scrollTop+clientHeight)

	// 	if(this.getScrollHeight() == this.getScrollTop() + this.getClientHeight()){
	// 		dispatch({
	// 			type: 'video/changePagination',
	// 			isSelectPagination: isSelectPagination+1
	// 		})
	// 		dispatch({
	// 			type: 'video/get/series',
	// 			id: id,
	// 			count: 'part',// 写到这里，记得all
	// 			mode: 'scrollList', 
	// 			pagination: isSelectPagination+1,
	// 		})
	// 	}
	// }
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
		{/*<Scrollbars autoHeight={true} autoHide={true} onScrollStop={handleScrollUpdate.bind(this)}>
		<div className={styles.displayVideoList}>
		{ renderVideoList() }
		</div>
		</Scrollbars>*/}
		<VideoList videoList={renderVideoList()} />
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