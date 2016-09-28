import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb, Row, Col, Icon, Pagination, Spin } from 'antd';
import Layout from '../layouts/Layout/Layout';

import Title from '../components/Title/Title';
import Menu from '../components/Menu/Menu';
import PostForm from '../components/PostForm/PostForm';

import VideoCover from '../components/Widget/VideoCover/VideoCover';
import TestCover from '../components/Widget/TestCover/TestCover';
import TextCover from '../components/Widget/TextCover/TextCover';
import PostCover from '../components/Widget/PostCover/PostCover';

//import { data } from '../services/video.js';//向user传送的数据


import styles from './commont.less';

const Category = ({ location, dispatch, context }) => {
	const { stateName, category, categoryTitle, total, isSelectPagination, isSelectCategory, loading } = context;

	const handleRequst = () =>{
		dispatch({
			type: `${stateName}/get/categorySource`,
		})
	}

	const handleChangeCategory = (id) =>{
		dispatch({
			type: `${stateName}/changeCategory`,
			isSelectCategory: id
		})
		window.location.hash = `#!/${id}/1`;
		//data['category']=id;
		//data['pagination']=1;
		handleRequst();
	}
	const handleChangePagination = (id) =>{
		dispatch({
			type: `${stateName}/changePagination`,
			isSelectPagination: id
		})
		window.location.hash = `#!/${isSelectCategory}/`+id;
		//data['category']=isSelectCategory;
		//data['pagination']=id;
		handleRequst();
	}

	const handleToggleForumModal = () =>{
		const { modalState } = context;
		dispatch({
			type: `forum/ToggleForumModal`,
			modalState: modalState
		})
	}

	const handleSubmitPost = () =>{
		dispatch({
			type: `forum/SubmitPost`
		})
	}

	const breadcrumbList = () =>{
		if(isSelectCategory !== category.length){
			return category[isSelectCategory]
		}
		else return '';
	}

	const renderList = () =>{
		if(context.categorySource.loading){
			return <Spin />;
		}
		switch(stateName){
			case 'video': 
			return context.categorySource.list.map((video,index) =>{
				if(!video.show) return
				return(
					<Col span={8} lg={6} key={index}> 
					<VideoCover data={video} type='small' />
					</Col>
				)
			})
		}
	}

	const forumExetend = () =>{
		if(stateName == 'forum') return (
			<PostForm 
			onClick={handleToggleForumModal.bind(this)}
			onCancel={handleToggleForumModal.bind(this)} 
			onOk={handleSubmitPost.bind(this)}
			 confirmLoading={context.isPostForm}
			  visible={context.modalState}
			  />);
	}

	return (
		<Layout location={location} type={2}>
			<div className={styles.contain}>
		<Row>
		<Spin spinning={ loading } >

		<Col span={8} lg={6}>
		{ forumExetend() }
		<Title type='small' title={ categoryTitle } noline={true} />
		<Menu menu={category}
		isSelect={isSelectCategory}
		changeCategory={handleChangeCategory.bind(this)}
		/>
		</Col>

		<Col span={16} lg={18}>
		<div className={styles.margin}>
			<Breadcrumb>
						<Breadcrumb.Item>
						<Icon type="home" />
						</Breadcrumb.Item>
						<Breadcrumb.Item>
						<Link to={{ pathname:`${location.pathname}`}}>全部课程</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>
						{ breadcrumbList() }
						</Breadcrumb.Item>
			</Breadcrumb>
			
		</div>
			
			<Row>
			{/**<TestCover type='big' />
			<TestCover type='small' />
			<VideoCover type='big' />
			<TextCover wordtype='word' type='big' />
			<TextCover wordtype='word' type='small' />
			<PostCover type="big" commenttype="study" />
			<PostCover type="big" commenttype="study" />*/}
			{ renderList() }

			</Row>
		<div className={styles.margin}>
			<Pagination 
			onChange={handleChangePagination.bind(this)} 
			total={total} current={isSelectPagination} 
			pageSize={30} 
			defaultPageSize={12} 
			/>
		</div>
		</Col>
		</Spin>
		
		</Row>
		</div>
		</Layout>
	);
};

Category.PropTypes = {

};

function mapStateToProp({video,text,test,forum},{ location,}){//参数一可追加
	const state = () =>{
		const witch = location.pathname.replace(/\d/g,'').replace('/category/','').replace('/','');
		switch(witch){
			case 'video': return video;
			case 'test': return test;
			case 'text': return text;
			case 'forum': return forum;
			default: return;
		}

	}
	/*const filterCategoryandPagination = (store) =>{
		//if (store == null) return window.location.pathname = '/404';
		if (location.hash) {
			const match = pathToRegexp('#!/:category/:pagination').exec(location.hash);
			/*const select = location.hash.replace(/\D/g,'');
			const category = parseInt(select.charAt(0));
			const pagination = parseInt(select.slice(1));
			data['category']=category;
			data['pagination']=pagination;
			//store.dispatch({
			//	type: `${store.stateName}/get/categorySource`,
			//})
			const category = parseInt(match[1]);
			const pagination = parseInt(match[2]);
			data['category']=category;
			data['pagination']=pagination;
			/*history.listen(() =>{

				dispatch({
					type: `${store.stateName}/get/categorySource`,
				})
			})
			
			return { ...store, isSelectCategory: category, isSelectPagination: pagination }
		}
		else {
			return { ...store, isSelectCategory: 7, isSelectPagination: 1 }
		}
	}*/

	return {
	   context: state(),//context为当前读取的store（video，text，test）
	};
};

export default connect(mapStateToProp)(Category);