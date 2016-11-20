import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Badge } from 'antd';
import classnames from 'classnames';

import styles from './Menu.less';

const Menu = ({ menu, isSelect, changeCategory }) => {

	const renderMenu = () =>{
		return(
			<div>
			{menu.map((title, index) =>{
				const menuCls = classnames({
					[styles.active]: isSelect === index,
					[styles.yellow]: true,
					
				});
				/**let menuCls = () =>{
					if (index % 2 == 0) return styles.yellow;
					else return styles.purple;
				};**/
				return <div key={ index } >
						
						<div className={menuCls} onClick={changeCategory.bind(this,index)}>
						<a>
						{/*<Link to={{ pathname:`${location.pathname}`, hash:`#!/${index}`}} >*/}
						<span className={styles.subTitle}>{ title }</span>
						</a>
						</div>
						
						{/**<div className={styles.float}>
						<Badge count={ menu.sum } />
						</div>**/}
					   </div>;
			})}
			</div>
		)
	};
	return (
		<div>
			{renderMenu()}
		</div>
	);
}

Menu.propTypes = {  
	/*title: PropTypes.string.isRequired,*/
};


export default Menu;