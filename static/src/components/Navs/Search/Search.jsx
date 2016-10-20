import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { Input, Select, Button, Icon } from 'antd';
import classNames from 'classnames';

import styles from './Search.less';

const Search = () => {
  const btnCls = classNames({
      'ant-search-btn': true,
      //'ant-search-btn-noempty': !!this.state.value.trim(),
    });
  const searchCls = classNames({
    'ant-search-input': true,
    //'ant-search-input-focus': this.state.focus,
  });
  return (
    
    <div className="ant-search-input-wrapper">
        <Input.Group className={searchCls}>
        
          <Select 
            combobox
            className={styles.input}
            filterOption={false}
            showSearch={true}
            placeholder="输入文字搜索"
            notFoundContent="然而什么也没有"
          >
          </Select>
          <div className="ant-input-group-wrap">
          <Button className={btnCls+" "+styles.btn}>
            <Icon type="search" />
          </Button>
          </div>
          
        </Input.Group>
    </div>
    
    );
}

Search.propTypes = {  
  //text: PropTypes.element.isRequired,
  /*text: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
  ]),*/
};

export default Search;