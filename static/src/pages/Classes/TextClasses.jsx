import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Breadcrumb, Row, Col, Icon } from 'antd';
import Layout from '../../layouts/Layout/Layout';

import Title from '../../components/Title/Title';
import Menu from '../../components/Menu/Menu';
import TextCovers from '../../components/Widget/TextCover/TextCovers';

import styles from '../commont.less';

class TextMenu extends React.Component{
	render(){
		return <Menu linkto="text" title="文库分类" />;
	}
}

class TextBreadcrumb extends React.Component{
	render(){
		return <Breadcrumb><Breadcrumb.Item><Icon type="home" /></Breadcrumb.Item><Breadcrumb.Item>全部文本</Breadcrumb.Item></Breadcrumb>;
	}
}

class TextCover extends React.Component{
	render(){
		return 	<TextCovers />;
	}
}

const TextClasses = {
	menu: TextMenu,
	breadcrumb: TextBreadcrumb,
	cover: TextCover
};

/**VideoClasses.PropTypes = {

};**/

export default TextClasses;