import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col, Carousel } from 'antd';



import styles from './NavCarousel.less';

const NavCarousel = () => {
	return (
	<div>
	
	<div> 
		<Carousel autoplay={true}
				  effect='fade'
				  className={styles.height}
		>
		    <div>
		    	<div className={styles.show}></div>
		    </div>
		    <div>
		    	<div className={styles.show}></div>
		    </div>
	    </Carousel>
	</div>
	{/*<!--
	<div className={styles.classes}>
		<Row>
			<Col span={4}>
			</Col>
		</Row>
	</div>-->*/}
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