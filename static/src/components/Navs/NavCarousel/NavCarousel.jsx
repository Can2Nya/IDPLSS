import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Carousel } from 'antd';

import styles from './NavCarousel.less';

const NavCarousel = () => {
	return (
	<div> 
		<Carousel 
		autoplay={true}
		effect='fade'
		className={styles.height}
		>
		    <div style={{backgroundColor: '#A89885'}}>
		    	<div className={styles.show} style={{backgroundImage: `url('http://ocaxzmfrd.bkt.clouddn.com/xiaoyujyaw8.png')`}}></div>
		    </div>
		    <div style={{backgroundColor: '#000'}}>
		    	<div className={styles.show} style={{backgroundImage: `url('http://ocaxzmfrd.bkt.clouddn.com/3.png')`}}></div>
		    </div>
	    </Carousel>
	</div>
	);
}

NavCarousel.propTypes = {  
	//text: PropTypes.element.isRequired,
	/*text: PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number,
	]),*/
};

export default NavCarousel;