import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Icon, Form, Modal, Select, Radio, Input } from 'antd';
import classNames from 'classnames';

import Button from '../../Button/Button';
// import config from '../../config/config.js';
import styles from './UploadItem.less';

let UploadItem = ({ upload, user, dispatch, form, data, index, onChange, onDelete }) => {
	// data为editpannel传入的数据【不然咱自己有要遍历列表
	// form为队列（uploadqueue）传入
	const { loginUserList, userZoneList, total } = user
	const { getFieldProps, validateFields, getFieldValue } = form;
	const { tmpFile, uploadList, uploadListProgress, uploadListFiles, token, itemModalState, progress, isSelectMenuItem } = upload

	// -----------form rule-----------------

	// ------------render-------------------
	const renderProgresses = () =>{
		// if(data.file && data.file.length > 0){
		// 	data.file.map((f) =>{
		// 		return f.onprogress = (e) =>{
		// 			console.log(1)
		// 			console.log(e.percent)
		// 			e.percent
		// 		}
		// 	})
		// }
		// if(tmpFile.length > 0){//修改上传的
		// 	tmpFile.map((f) =>{
		// 		f.onprogress = (e) =>{
		// 			return e.percent
		// 		}
		// 	})
		// }
		if(data.file && data.file.length > 0){
			return uploadListProgress[data.file[0].preview]
		}
		else return 100
	}
	return (
		<div style={{position: 'relative'}}>
		<div className={styles.block}>
		<Row type='flex' align='middle'>
		<Col span={19}>
		<div className={styles.title}>
		{ data.video_name || data.problem_description }
		</div>
		</Col>
		<Col span={5}>
		<span>
		<a className={styles.button} onClick={onChange.bind(this,data,index)}>
		<Icon type="edit" />
		</a>
		<a className={styles.button} onClick={onDelete.bind(this,data,index)}>
		<Icon type="cross-circle" />
		</a>
		</span>
		</Col>
		</Row>
		

		</div>
		<div className={styles.progress} style={{ width:`${renderProgresses()}%`}}></div>
		<div className={styles.progressBg}></div>
		</div>
	);
};

UploadItem.propTypes = {  
	
};

function mapStateToProp({ upload, user }){
	return{
		upload: upload,
		user: user
	};
}

export default connect(mapStateToProp)(UploadItem);