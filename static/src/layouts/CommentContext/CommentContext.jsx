import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Row } from 'antd';
import config from '../../config/config.js';

import styles from './CommentContext.less';

const CommentContext = ({ children, title }) => {

  return (
    <div className={styles.containbg}>
      <div className={styles.title}>{title}</div>
      { children }
    </div>
  );
};

CommentContext.propTypes = {
  //children: PropTypes.element.isRequired,
};


export default CommentContext;
