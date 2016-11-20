import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
// import { Button as AntdButton } from 'antd';
import classNames from 'classnames';
import G2 from 'g2'

import styles from './PieChart.less';

const PieChart = React.createClass({
	getInitialState(){
		return{
				// videoElement: null,
				// url: '',
			time: Date.now(),
		}
	},
	renderChart(data) {
		let Stat = G2.Stat;
		let chart = new G2.Chart({
			id: `pie-${this.state.time}`,
			width : 950,
			height : 400,
			plotCfg: {
				margin: [60, 60, 80, 120]
			}
		})
		chart.source(data, {
		// '..count': {
		// 	alias: 'top2000 唱片总量'
		// },
		// release: {
		// 	tickInterval: 5,
		// 	alias: '唱片发行年份'
		// }
			'catagory': {
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
		});

		chart.coord('theta', {
			radius: 0.8 // 设置饼图的大小
		});
		chart.tooltip({
			title: null,
			map: {
			  	value: 'value'
			}
		});
		chart.legend('catagory', {
			position: 'bottom'
		});
		chart.legend('bottom');

		chart.intervalStack().position(Stat.summary.percent('value')).color('catagory')
			.label('catagory*..percent',function(name, percent){
				percent = (percent * 100).toFixed(2) + '%';
				return name + ' ' + percent;
			});
		chart.render();
		console.log('ok')
		let geom = chart.getGeoms()[0]; // 获取所有的图形
		let items = geom.getData(); // 获取图形对应的数据
		geom.setSelected(items[1]); // 设置选中

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
		return(<div id={`pie-${this.state.time}`}></div>)
	}
})

// PieChart.propTypes = {  
	
// };

export default PieChart;