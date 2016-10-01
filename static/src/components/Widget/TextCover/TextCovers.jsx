import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import classNames from 'classnames';
import TextCover from './TextCover';

import styles from './TextCovers.less';

const TextCovers = () => {
	const renderTextCover = () =>{
		const sum = [{},{},{},{},{}];
		return (
			sum.map(textcover =><Col lg={6} span={8} className={styles.marginBlock}>
				<div >
				<TextCover type="word" />
				</div>
				</Col>)
		);
	};
	return (
		<Row>
		{renderTextCover()}
		</Row>
	);
};

TextCovers.propTypes = {  
	
};

/**function mapStateToProp({layout},{location}){
  return {
    layout: filter(layout,location.pathname)
  };
}**/

export default TextCovers;