import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row, Col } from 'antd';
import classNames from 'classnames';

import styles from './TextCover.less';

const TextCover = ({ wordtype, type, data }) => {
	const typeCls = () =>{
		/*大小*/
		return classNames({
			[styles[type]]:true,
		})
	}
	const coverCls = () =>{
		/*文件类型*/
		const word = ['other','word','excel','pdf','ppt']
		return classNames({
			[styles[word[wordtype]]]:true,
		})
	};
	const renderTextCover = () =>{
		if(type == 'big') return <div className={typeCls()}>
			<div className={coverCls()}>
			<Link to={{ pathname: `/detail/text/${data.id}/`, hash: '#!/comment/'}}>
			<div className={styles.title}>{ data.resource_name }
			</div>
			</Link>
			
			<div className={styles.subtitle}>{ data.author_name }</div>
			
		</div>
		</div>;
		if(type == 'small') return <div className={typeCls}>
			<div className={coverCls}>
			<Link to={{ pathname: `/detail/text/${data.id}/`, hash: '#!/comment/'}}>
			<div className={styles.title}>{ data.resource_name }</div>
			</Link>
			</div>
			
			</div>;
	}
	return renderTextCover();
};

TextCover.propTypes = {  
	
};

export default TextCover;