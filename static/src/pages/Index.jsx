import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import classNames from 'classnames';
import Layout from '../layouts/Layout/Layout';

import Title from '../components/Title/Title';
import VideoCover from '../components/Widget/VideoCover/VideoCover';
import TextCover from '../components/Widget/TextCover/TextCover';

import styles from './commont.less';

const Index = ({ location }) => {


	return (
		<Layout location={location}>
		<div className={styles.contain}>
			<div className={styles.marginCenter}>
			<Title type='big'  title='推荐课程' />
			</div>
			<div className={styles.margin}>
			
			</div>
			<div className={styles.marginCenter}>
			<Title type='big'  title='推荐文档' />
			</div>
			<div className={styles.margin}>
			
			</div>
			<div className={styles.marginCenter}>
			<Title type='big'  title='真题测试' />
			</div>
			<div className={styles.marginCenter}>
			<Title type='big'  title='更多内容' />
			</div>
		</div>
		</Layout>
	);
};

Index.PropTypes = {

};

export default Index;