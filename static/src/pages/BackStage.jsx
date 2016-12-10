import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Icon, Tabs, Menu, Pagination, Modal, Spin } from 'antd';

import BackStageLayout from '../layouts/BackStageLayout/BackStageLayout';

import styles from './commont.less';
import config from '../config/config.js'

// 后台可以分配权限，删除资料
const Backstage = ({}) =>{
	return(
		<BackStageLayout />
	)
}

function mapStateToProp({ upload, user }){
	return{
		upload: upload,
		user: user
	};
}

export default connect(mapStateToProp)(Backstage)