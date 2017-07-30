import React, { Compont,PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import pdfjs from 'pdfjs-dist/web/pdf_viewer.js';
import 'pdfjs-dist/web/pdf_viewer.css';

const PlayText = ({ text, dispatch, location }) =>{
	// 回头有时间再写吧。。。。。。

	let RenderPDF = React.createClass({
			componentDidMount()	{
				// pdfjs.PDFJS.disableAutoFetch = true;
				// pdfjs.PDFJS.workerSrc = 'http://ocaxzmfrd.bkt.clouddn.com/pdf.worker.js';
				// pdfjs.PDFJS.getDocument("http://ocaxzmfrd.bkt.clouddn.com/1_%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E5%AE%9E%E9%AA%8C%E6%8A%A5%E5%91%8A%E6%A8%A1%E6%9D%BF%E4%B8%8E%E8%8C%83%E4%BE%8B.pdf").then(
				// 	function (pdf) {
				// 	console.log(pdf)
				// 	// Fetch the page.
				// 	pdf.getPage(1).then(function (page) {
				// 		let scale = 1.5;
				// 		let viewport = page.getViewport(scale);

				// 		// Prepare canvas using PDF page dimensions.
				// 		let canvas = document.getElementById('the-canvas');
				// 		let context = canvas.getContext('2d');
				// 		canvas.height = viewport.height;
				// 		canvas.width = viewport.width;

				// 		page.render({
				// 			canvasContext: context,
				// 			viewport: viewport
				// 		});
				// 	})
				// })
			},
			displayName: 'RenderPDF',
			render() {
				return (
					<div id="mainContainer">
					
					</div>
				);
			}
		})
	RenderPDF.Item = React.createClass({
		componentDidMount() {

		},
		render(){
			<canvas id="the-canvas" style={{border:'1px solid black'}}/>
		}
	})
	return (
		<div>
		<RenderPDF />
		</div>
	);
}

PlayText.PropTypes = {

};

function mapStateToProp({ text }){
	return{
		text: text,
	}
}

export default connect(mapStateToProp)(PlayText);