import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button, Card } from 'antd';
import classNames from 'classnames';

import styles from './TestCover.less';

const TestCover = ({ type, data }) => {
	const coverCls = () =>{
		/*if(type == 'small') return styles.small;
		if(type == 'big') return styles.big;*/
		return classNames({
			[styles[type]]:true,
		})
	};

	const renderTestCover = () =>{
		if (type == 'small') return <Card >
			<Link to={{ pathname: `/detail/test/${data.id}/`, hash: '#!/series/1/'}}>
			<p className={styles.title}>{data.test_title}</p>
			</Link>
			<Link to={{pathname: `/user/${data.author_id}/`, hash: '#!/dynamic/0/' }} >
			<p>{data.author_name}</p>
			</Link>
			</Card>
			;
		if (type == 'big') return <Row>
			<Col lg={21} span={18}>
			<div className={styles.title}>{data.test_title}</div>
			<Link to={{pathname: `/user/${data.author_id}/`, hash: '#!/dynamic/0/' }} >
			<div className={styles.subtitle}>{data.author_name}</div>
			</Link>
			</Col>
			<Col lg={3} span={6}>
			<Link to={{ pathname: `/detail/test/${data.id}/`, hash: '#!/series/1/'}}>
			<Button className={styles.button}>开始测试</Button>
			</Link>
			</Col>
			</Row>
		;
	}
	return (
		<div className={coverCls()}>
			{renderTestCover()}
		</div>
	);
};

TestCover.propTypes = {  
	
};

export default TestCover;