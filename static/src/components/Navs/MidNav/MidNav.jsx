import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button } from 'antd';

import Search from '../Search/Search';
import NavCarousel from '../NavCarousel/NavCarousel';

import styles from './MidNav.less';

const MidNav = () => {
	return (
			<div>
				<div className={styles.nav}>
					<div className={styles.navcontain}>
						<Row className={styles.row}
								 align='middle'
						>
							<Col span={4}
							>
							<Button className={styles.active}><Link to={{ pathname:`/category/video/`}}>全部课程</Link></Button>
							</Col>
							<Col span={3}>
							<Button><Link to="/">首页</Link></Button>
							</Col>
							<Col span={3}>
							<Button><Link to={{ pathname:`/category/text/`}}>文库</Link></Button>
							</Col>
							<Col span={3}>
							<Button><Link to={{ pathname:`/category/test/`}}>在线测试</Link></Button>
							</Col>
							<Col span={3}>
							<Button><Link to={{ pathname:`/category/forum/`}}>学习交流</Link></Button>
							</Col>
							<Col span={6}
							>
							<Search />
							</Col>
						</Row>
						<div className={styles.position}>
								<div className={styles.navlist}>
								</div>
						</div>
					</div>
					
				</div>
				<NavCarousel />
			</div>
		);
}

MidNav.propTypes = {  
	//text: PropTypes.element.isRequired,
	/*text: PropTypes.oneOfType([
	      React.PropTypes.string,
	      React.PropTypes.number,
  ]),*/
};

export default MidNav;