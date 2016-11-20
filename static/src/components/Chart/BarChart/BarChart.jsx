import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
// import { Button as AntdButton } from 'antd';
import classNames from 'classnames';
import G2 from 'g2'

import styles from './BarChart.less';

const BarChart = React.createClass({
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
			id: `bar-${this.state.time}`,
			width : 650,
			height : 350,
			plotCfg: {
				margin: [60, 60, 80, 120]
			}
		})
		let Frame = G2.Frame;
		let frame = new Frame(data);
		frame = Frame.sort(frame, 'time');
		chart.source(frame, {
		// '..count': {
		// 	alias: 'top2000 唱片总量'
		// },
		// release: {
		// 	tickInterval: 5,
		// 	alias: '唱片发行年份'
		// }
			time: {
				tickInterval: 2,
				nice: true,
				alias: '学习频率统计(小时)'
				// type: 'cat',
				// values: ['0点','1点','2点','3点','4点','5点','6点','7点','8点','9点','10点','11点','12点','13点','14点','15点','16点','17点','18点','19点','20点','0点','0点','0点','0点',]
			},
			value: {
				alias: '频率'
			}
		});
		chart.interval().position('time*value').color('#523552');
		chart.render();
		

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
		return(<div id={`bar-${this.state.time}`}></div>)
	}
})

// BarChart.propTypes = {  
	
// };

export default BarChart;