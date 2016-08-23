import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Badge } from 'antd';

import styles from './Menu.less';

const Menu = ({ menu, linkto, title,location }) => {
	const renderMenu = () =>{
		const { list } = menu;
		return(
			<div>
			{list.map((menu, index) =>{
				/**let menuCls = () =>{
					if (index % 2 == 0) return styles.yellow;
					else return styles.purple;
				};**/
				return <div key={ menu.id } >
						<Link to={{ pathname:`${location.pathname}`, hash:`#!/${menu.id}`}} activeClassName={styles.active}>
						<div className={styles.yellow}>
						<span className={styles.subTitle}>{ menu.title }</span>
						</div>
						</Link>
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
			<div className={styles.title}>{ title }</div>
			{renderMenu()}
		</div>
	);
}

Menu.propTypes = {  
	title: PropTypes.any.isRequired,
	linkto: PropTypes.any.isRequired
};

function mapStateToProps({ menu }){
	return {
		menu: menu
	};
};

export default connect(mapStateToProps)(Menu);