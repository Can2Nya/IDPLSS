import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, Icon, Progress } from 'antd';
import Sortable, { SortableContainer } from 'react-anything-sortable';
import Qiniu from 'react-qiniu'

import config from '../../config/config.js';
import styles from './EditPannel.less';
import 'react-anything-sortable/sortable.css';

import Banner from '../../components/Banner/Banner';
import MidNav from '../../components/Navs/MidNav/MidNav';
import TopNav from '../../components/Navs/TopNav/TopNav';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';

import UploadItem from '../../components/Widget/UploadItem/UploadItem';


let EditPannel = ({ upload, user, dispacth, onBackClick }) => {
// -----------------form rule-----------------------
	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 },
	};
	// --------------action ------------------------
	const handleDrop = (files) =>{
		dispatch({
			type: 'upload/drop',
			files: files
		})
	}
	const handleUpload = (files) =>{
		let progresses = {};
		files.map((f) =>{
			f.onprogress = (e) =>{
				progresses[f.preview] = e.percent
				dispatch({
					type: 'upload/setProgress',
					progress: progresses
				})
			}
		})
	}
	const handleSort = (e) =>{
		console.log(e)
	}
	
	return (
		<div className={styles.block}>
		<Form>
		<div className={styles.cuttingLine}>
		<a>
		<span onClick={onBackClick}>
		<Icon type="arrow-left" /> 
		 返回
		</span>
		</a>
		</div>
		<div className={styles.title}>课程描述</div>
		<Row>
			<Col span={8}>
				<Form.Item 
				help="仅限图片格式,尺寸尽量保持200*120"
				hasFeedback>
				<a>
				<Qiniu 
					onDrop={handleDrop.bind(this)} 
					accept='image/*'
					size={150} 
					style={{border: '0'}}
					token={token} 
					multiple={false}
					onUpload={handleUpload.bind(this)}>
				<div className={styles.preview}>
				</div>
				</Qiniu>
				</a>
				</Form.Item>
				<div className={styles.button}>
				<Button type="ghost">保存</Button>
				</div>
			</Col>
			<Col span={15}>
			<Form.Item
			{...formItemLayout}
			label='标题'
			hasFeedback
			>
				<Input type="text" />
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label='描述'
			hasFeedback
			>
				<Input type="textarea" />
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label="分类"
			>
			<Select /*{...selectProps}*/ placeholder="请选择稿件分类" style={{ width: '100%' }}>
			<Select.Option value={0}>计算机/互联网</Select.Option>
			<Select.Option value={1}>基础科学</Select.Option>
			<Select.Option value={2}>工程技术</Select.Option>
			<Select.Option value={3}>历史哲学</Select.Option>
			<Select.Option value={4}>经管法律</Select.Option>
			<Select.Option value={5}>语言文化</Select.Option>
			<Select.Option value={6}>艺术音乐</Select.Option>
			<Select.Option value={7}>兴趣生活</Select.Option>
			</Select>
			</Form.Item>
			</Col>
		</Row>

		<div className={styles.cuttingLine}></div>
		<div className={styles.title}>添加课程视频</div>

		<div className={styles.video}>
		<Sortable onSort={handleSort.bind(this)}>
		<SortableContainer sortData="1" key='1'>
		<div>
		<UploadItem data={{title: '这里是1'}} />
		</div>

		{/*<Form.Item
			{...formItemLayout}
			label='上传进度'
			hasFeedback
			>
			<Progress percent={50} status="active" />
		</Form.Item>
		<Form.Item
			{...formItemLayout}
			label='标题'
			hasFeedback
			>
				<Input type="text" />
			</Form.Item>
			<Form.Item
			{...formItemLayout}
			label='描述'
			hasFeedback
			>
			<Input type="textarea" />
			</Form.Item>*/}
		
		</SortableContainer>
		<SortableContainer sortData="2" key='2'>
		<div>
		<UploadItem data={{title: '这里是2'}} />
		</div>
		</SortableContainer>
		</Sortable>
		</div>
		<Button type='ghost'>上传文件</Button>

		</Form>
		</div>
	);
};

EditPannel.propTypes = {
	//children: PropTypes.element.isRequired,
};

EditPannel = Form.create()(EditPannel)

function mapStateToProp({ upload, user }){
	return{
		upload: upload,
		user: user
	};
}

export default connect(mapStateToProp)(EditPannel);
