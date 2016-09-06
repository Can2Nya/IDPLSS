import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon } from 'antd';
import Layout from '../../layouts/Layout/Layout';

import Title from '../../components/Title/Title';
import Menu from '../../components/Menu/Menu';
import VideoCovers from '../../components/Widget/VideoCover/VideoCovers';

import styles from '../commont.less';

class VideoMenu extends React.Component{
	render(){
		return <Menu title="课程分类" location={location} />;
	}
}

class VideoBreadcrumb extends React.Component{
	render(){
		return <Breadcrumb>
		<Breadcrumb.Item>
		<Link to="/">
		<Icon type="home" />
		</Link>
		</Breadcrumb.Item>
		<Link to='/video/'>
		<Breadcrumb.Item>全部课程</Breadcrumb.Item>
		</Link>
		</Breadcrumb>;
	}
}

class VideoCover extends React.Component{
	render(){
		return 	<VideoCovers />;
	}
}

const VideoClasses = {
	/*menu: VideoMenu,*/
	breadcrumb: VideoBreadcrumb,
	/*cover: VideoCover*/
};

/**VideoClasses.PropTypes = {

};**/

export default VideoClasses;