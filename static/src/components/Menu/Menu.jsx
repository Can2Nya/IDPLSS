import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Badge } from 'antd';
import classnames from 'classnames';

import styles from './Menu.less';

const Menu = ({ menu, isSelect, changeCategory }) => {
	/*
	const { list } = menu;
	const handleToggleSelect = (id) =>{
		dispatch({
			type: 'menu/isSelect',
			payload: id,
		})
		/**let selectkey;
		if(location.hash) selectkey = location.hash.replace(/\D/g,'');
		console.log(selectkey)
		return (selectkey.charAt(0) === id)? true: false;
	};*/

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
			{/*<div className={styles.title}>{ title }</div>*/}
			{renderMenu()}
		</div>
	);
}

Menu.propTypes = {  
	/*title: PropTypes.string.isRequired,*/
};

/*function menuFilter(menu, hash) {
	if(hash){
		var newSelectkey = hash.replace(/\D/g,'');
		newSelectkey = parseInt(newSelectkey.charAt(0));
		const newList = menu.list.map(line =>{
			if( newSelectkey == line.id ) {
				return { ...line, isSelect: true }
			}
			else {
				return { ...line, isSelect: false }
			}
			return true;
		});
		return { ...menu, list: newList, selectkey: newSelectkey };
	}
	return menu;
	
}

function mapStateToProps({ menu },{ location }){
	return {
		menu: menuFilter(menu,location.hash),
	};
};

export default connect(mapStateToProps)(Menu);*/

export default Menu;