import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
// import { Button as AntdButton } from 'antd';
import classNames from 'classnames';
import G2 from 'g2'

import styles from './RadarChart.less';

const RadarChart = React.createClass({
	getInitialState(){
		return{
			time: Date.now(),
		}
	},
	renderChart(data) {
		let Stat = G2.Stat;
		let chart = new G2.Chart({
			id: `radar-${this.state.time}`,
			width : 950,
			height : 400,
			plotCfg: {
				margin: [60, 60, 80, 120]
			}
		})
		chart.source(data, {
			'value' :{
				min: 0,
				max: 1,
				tickCount: 5,
			},
			'category': {
				type: 'cat',
				values: [
				'互联网/计算机',
				'基础科学',
				'工程技术',
				'历史哲学',
				'经管法律',
				'语言文学',
				'艺术音乐',
				'兴趣生活',
				]
			},
			obj: {
				values: ['我'],
			}
		});

		chart.coord('polar');
		chart.legend('obj', {
			title: null,
			position: 'bottom'
		});

		chart.axis('category',{ // 设置坐标系栅格样式
			line: null
		});
		chart.axis('value',{ // 设置坐标系栅格样式
			grid: {
				type: 'polygon' //圆形栅格，可以改成
			}
		});
		chart.line().position('category*value').color('obj');
		chart.point().position('category*value').color('obj').shape('circle');
		chart.area().position('category*value').color('obj');
		chart.render();
		console.log('ok')

	},
	componentDidMount()	{
		this.renderChart(this.props.data)
	},
	shouldComponentUpdate(){
		return false;
	},
	componentWillReceiveProps(nextProps){
		return false;
	},
	render(){
		return(<div id={`radar-${this.state.time}`}></div>)
	}
})

// RadarChart.propTypes = {  
	
// };

export default RadarChart;