import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Button } from 'antd';

import Search from '../Search/Search';
import Massage from '../Massage/Massage';
import User from '../User/User';

import styles from './TopNav.less';

const TopNav = ({ config }) => {
	return (
		<div className={styles.nav}>
			<div className={styles.navcontain}>
			
			<div className={styles.img}>
			<img src={config.logos} />
			</div>
			<div className={styles.position}>
				<div className={styles.col}
				>
				<Link to="/" activeClassName={styles.active}><Button>首页</Button></Link>
				</div>
				<div className={styles.col}
				>
				<Link to={{ pathname:`/category/video/`}} activeClassName={styles.active}><Button>课程体系</Button></Link>
				</div>
				<div className={styles.col}
				>
				<Link to={{ pathname:`/category/text/`}} activeClassName={styles.active}><Button>文库</Button></Link>
				</div>
				<div className={styles.col}
				>
				<Link to={{ pathname:`/category/test/`}} activeClassName={styles.active}><Button>在线测试</Button></Link>
				</div>
				<div className={styles.col}
				>
				<Link to="/bbs/" activeClassName={styles.active}><Button>学习交流</Button></Link>
				</div>
			</div>
			<div className={styles.right}
			>
			<div className={styles.flex}>
				<div className={styles.col}>
					<Search />
				</div>
				<div className={styles.col}  style={{marginLeft:'30px'}}>
					<Massage />
				</div>
				<div className={styles.col}>
					<User />
				</div>
			</div>
			</div>
			
			</div>

			{/*<Row align="middle">
			<Col span={4}><Col>
			<Col span={6}><Col>
			<Col span={6}><Col>
			</Row>*/}
		</div>
	);
}

TopNav.propTypes = {  
	//text: PropTypes.element.isRequired,
	/*text: PropTypes.oneOfType([
	      React.PropTypes.string,
	      React.PropTypes.number,
  ]),*/
};

export default TopNav;