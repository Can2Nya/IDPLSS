import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon } from 'antd';
import Layout from '../layouts/Layout/Layout';

import Title from '../components/Title/Title';
import Menu from '../components/Menu/Menu';
import VideoCover from '../components/Widget/VideoCover/VideoCover';
import TestCover from '../components/Widget/TestCover/TestCover';
import TextCover from '../components/Widget/TextCover/TextCover';

import styles from './commont.less';

const Category = ({ location }) => {
	return (
		<Layout location={location}>
			<div className={styles.contain}>
		<Row>
		<Col span={8} lg={6}>
		<Title type='small' title='课程分类' noline={true} />
		<Menu location={location}  />
		</Col>

		<Col span={16} lg={18}>
		<div className={styles.margin}>
			<Breadcrumb>
						<Breadcrumb.Item>
						<Icon type="home" />
						</Breadcrumb.Item>
						<Breadcrumb.Item>
						全部课程
						</Breadcrumb.Item>
			
						</Breadcrumb>
		</div>
			<Row>
			<TestCover type='big' />
			<TestCover type='small' />
			<VideoCover type='big' />
			<TextCover wordtype='word' type='big' />
			<TextCover wordtype='word' type='small' />
			</Row>
		</Col>
		</Row>
		</div>
		</Layout>
	);
};

Category.PropTypes = {

};

export default Category;