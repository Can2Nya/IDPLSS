import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { Form, Input, Select, Button, Icon } from 'antd';
import classNames from 'classnames';

import styles from './Search.less';

let Search = ({ form }) => {
	const { getFieldProps, getFieldValue } = form;
	const btnCls = classNames({
			'ant-search-btn': true,
			//'ant-search-btn-noempty': !!this.state.value.trim(),
		});
	const searchCls = classNames({
		'ant-search-input': true,
		//'ant-search-input-focus': this.state.focus,
	});
	const handleSearchAction = () =>{
		browserHistory.push(`/search/#!/video/${getFieldValue('search')}/1/`)
	}
	return (
		<Form>
		<div className={styles.wrapper}>
		<Input.Group>
			<Input placeholder="输入文字搜索"
			{...getFieldProps('search',{
				initialValue: ' ',
			})}
			onPressEnter={handleSearchAction.bind(this)}
			/>
			<a onClick={handleSearchAction.bind(this)}><Icon type="search" /></a>
		</Input.Group>
		</div>
		</Form>
		);
}

Search.propTypes = {
	//text: PropTypes.element.isRequired,
	/*text: PropTypes.oneOfType([
				React.PropTypes.string,
				React.PropTypes.number,
	]),*/
};

Search = Form.create()(Search)

export default Search;