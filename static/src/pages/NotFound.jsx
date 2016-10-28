import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import classNames from 'classnames';

import Layout from '../layouts/Layout/Layout';
import CommentContext from '../layouts/CommentContext/CommentContext';

import Button from '../components/Button/Button';

import styles from './commont.less';

const NotFound = () => {
  return (
	
	<CommentContext title='出错啦！'>
		<p>你访问了这个网站未知的边界，点击按钮返回主页</p>
		<a href="/"><Button type="primary" style={{ marginTop: 5 }}>返回首页</Button></a>
	</CommentContext>
	
  );
};

export default NotFound;
