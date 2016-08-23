import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon } from 'antd';
import Layout from '../layouts/Layout/Layout';

import Title from '../components/Title/Title';
import Menu from '../components/Menu/Menu';
import VideoCovers from '../components/Widget/VideoCover/VideoCovers';

import styles from './commont.less';

const Classes = ({ location, menu, breadcrumb, cover }) => {
	console.log(location);
	return (

		<Layout location={location}>
			<div className={styles.contain}>
		<Row>
		<Col span={8} lg={6}>
			{ menu }
		</Col>

		<Col span={16} lg={18}>
		<div className={styles.margin}>
			{/**<Breadcrumb>
						<Breadcrumb.Item>
						<Icon type="home" />
						</Breadcrumb.Item>
						<Breadcrumb.Item>
						全部课程
						</Breadcrumb.Item>
			
						</Breadcrumb>**/}
			{ breadcrumb }
		</div>
			<Row>
			{ cover }
			</Row>
		</Col>
		</Row>
		</div>
		</Layout>
	);
};

Classes.PropTypes = {

};

export default Classes;