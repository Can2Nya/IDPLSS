import React, { Component, PropTypes } from 'react';

import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars'
import config from '../../config/config.js';

import styles from './Layout.less';

import Banner from '../../components/Banner/Banner';
import MidNav from '../../components/Navs/MidNav/MidNav';
import TopNav from '../../components/Navs/TopNav/TopNav';
import Footer from '../../components/Footer/Footer';

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
			pathname: ['play','user','login']
		},]

// const Layout = ({ children, location, type }) => {//type后期再换上
const Layout = React.createClass({
	getInitialState() {
		return {
			layoutid: 0,
			height: document.body.offsetHeight || document.documentElement.clientHeight
		}	
	},
	layoutId(){
			let newLayoutid;
			layout.map(layoutList => {
				layoutList.pathname.map(layoutPath => {
						if(location.pathname.search(layoutPath) != -1 && location.pathname.search(layoutPath) != 0) {
							newLayoutid = layoutList.id;
						}
					}
				);
			});
			// return newLayoutid;
			this.setState({
				layoutid: newLayoutid
			})
	},
	componentWillMount(){
		this.layoutId()
	},
	
	scrollarea(){
		// return document.body.offsetHeight || document.documentElement.clientHeight
		this.setState({
			height: document.body.offsetHeight || document.documentElement.clientHeight
		})
	},
	renderLayout() {

		switch(this.state.layoutid){
			case 1: return(
				<div className={styles.contain}>
				<Scrollbars onScrollStart={this.scrollarea} style={{height: `${this.state.height}px`}}>
				<div >
					<Banner config={config} />
					<MidNav />
					{ this.props.children }
					<Footer config={config} />
				</div>
				</Scrollbars>
				</div>
				);
			case 2: return(
				<div className={styles.contain}>
					<TopNav config={config}/>
					<Scrollbars onScrollStart={this.scrollarea} style={{height: `${this.state.height}px`}}>
					<div >
					<div className={styles.body}>
					{ this.props.children }
					</div>
					<Footer config={config} />
					</div>
					</Scrollbars>
				</div>
				);
			case 3: return(
				<div className={styles.contain}>
					<TopNav config={config}/>
					<Scrollbars onScrollStart={this.scrollarea} style={{height: `${this.state.height}px`}}>
					<div className={styles.body} >
					{ this.props.children }
					</div>
					</Scrollbars>
				</div>
				);
		}
		
	},
	render(){
		return (
			<div>
				{this.renderLayout()}
			</div>
		);
	}
	
})

Layout.propTypes = {
	//children: PropTypes.element.isRequired,
};


export default Layout;
