import React, { Component, PropTypes } from 'react';

import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row } from 'antd';
import config from '../../config/config.js';

import styles from './Layout.less';

import Banner from '../../components/Banner/Banner';
import MidNav from '../../components/Navs/MidNav/MidNav';
import TopNav from '../../components/Navs/TopNav/TopNav';
import Footer from '../../components/Footer/Footer';


const Layout = ({ children, location, type }) => {//type后期再换上
	
	const layout = [{
			id: 1,
			pathname: ['/','index'],
		},
		{
			id: 2,
			pathname: ['category','detail','search','forum','register','post','manage']
		},
		{
			id: 3,
			pathname: ['play','user']
		},]

	const layoutId = () =>{
			let newLayoutid;
			layout.map(layoutList => {
				layoutList.pathname.map(layoutPath => {
						if(location.pathname.search(layoutPath) != -1 && location.pathname.search(layoutPath) != 0) {
							newLayoutid = layoutList.id;
							console.log('change layout'+newLayoutid+layoutPath);
						}
					}
				);
			});
			return newLayoutid;
		}
	const renderLayout = () => {

		switch(layoutId()){
			case 1: return(
				<div className={styles.contain}>
					<Banner config={config} />
					<MidNav />
					{ children }
					<Footer config={config} />
				</div>
				);
			case 2: return(
				<div className={styles.contain}>
					<TopNav config={config}/>
					<div className={styles.body}>
					{ children }
					</div>
					<Footer config={config} />
				</div>
				);
			case 3: return(
				<div className={styles.contain}>
					<TopNav config={config}/>
					<div className={styles.body}>
					{ children }
					</div>
				</div>
				);
		}
		
	}
	return (
		<div>
			{/*banner*/}
			{renderLayout()}
			{/*导航*/}
			{/*内容*/}
			
			{/*页脚*/}
		</div>
	);
};

Layout.propTypes = {
	//children: PropTypes.element.isRequired,
};


export default Layout;
