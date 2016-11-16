import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon, Tabs, Spin } from 'antd';
import classNames from 'classnames';
import videojs from 'video.js/dist/video.min.js';
// import config from '../../config/config';

import Button from '../Button/Button';
import config from '../../config/config.js'
import 'video.js/dist/video-js.min.css';

import styles from './VideoPlayer.less';

// const VideoPlayer = ({ location, data, index }) => {
	const videoCls = classNames({
		'video-js': true,
		'vjs-default-skin': true,
		[styles.video]: true,
	})
	const VideoPlayer = React.createClass({
		getInitialState(){
			return{
				// videoElement: null,
				// url: '',
				time: Date.now(),
			}
		},
		componentWillMount() {
		},
		componentDidMount()	{
			const play = videojs(`videoPlay-${this.state.time}`)
			play.src(this.props.url)
			// this.setState({
			// 	time: Date.now()
			// })
			// play.play();
		},
		shouldComponentUpdate(){
			return false;
		},
		componentWillReceiveProps(nextProps){
			const play = videojs(`videoPlay-${this.state.time}`)
			play.pause()
			play.src(nextProps.url)
		},
		render() {
			return(
				<video id={`videoPlay-${this.state.time}`} className={videoCls} controls preload='auto'>
				</video>
			)
		}
	})
	// return <Video />
// };

// VideoPlayer.propTypes = {  
	
// };

export default VideoPlayer;
// export default Video;