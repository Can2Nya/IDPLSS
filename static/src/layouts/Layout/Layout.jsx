import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row } from 'antd';
import config from '../../config/config.js';

import styles from './Layout.less';

import Banner from '../../components/Banner/Banner';
import MidNav from '../../components/Navs/MidNav/MidNav';
import TopNav from '../../components/Navs/TopNav/TopNav';
import Footer from '../../components/Footer/Footer';


const Layout = ({ layout, dispatch, children }) => {
  
  const handleLayout = () => {
    dispatch({
      type: 'layout/replace',
    });
  };

  const renderLayout = () => {
    const { layoutId } = layout;

    switch(layoutId){
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

function filter(layout,pathname){
  let newLayoutid;
  layout.list.map(layoutList => {
    layoutList.pathname.map(layoutPath => {
        if(pathname.search(layoutPath) != -1 && pathname.search(layoutPath) != 0) {
          newLayoutid = layoutList.id;
          console.log('change layout'+newLayoutid+layoutPath);
        }
      }
    );
  });
  
  return { ...layout, layoutId: newLayoutid };
}

function mapStateToProp({layout},{location}){
  return {
    layout: filter(layout,location.pathname)
  };
}

export default connect(mapStateToProp)(Layout);
