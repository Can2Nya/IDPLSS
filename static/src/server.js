// require('babel-register');
// require('css-modules-require-hook/preset');
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RoutingContext, match } from 'react-router';
import { Provider } from 'react-redux';
import routes from './routes/index.js';
import configureStore from './reducers/index.js';
// var express = require('express'),
// 	React = require('react'),
// 	renderToString = require('react-dom/server').renderToString,
// 	RoutingContext = require('react-router').RoutingContext,
// 	match = require('react-router').match,
// 	Provider = require('react-redux').Provider,
// 	routes = require('./routes/index.js'),
// 	configureStore = require('.reducers/index.js')


const app = express();

function renderFullPage(html, initialState) {
  return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
	</head>
	<body>
	  <div id="root">
		<div>
		  ${html}
		</div>
	  </div>
	  <script>
		window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
	  </script>
	  <script src="http://ocaxzmfrd.bkt.clouddn.com/common.js?fbfc5026fb6a421f9b94"></script>
	  <script src="http://ocaxzmfrd.bkt.clouddn.com/index.js?fbfc5026fb6a421f9b94"></script>
	</body>
	</html>
  `;
}

app.use((req, res) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
	if (err) {
	  res.status(500).end(`Internal Server Error ${err}`);
	} else if (redirectLocation) {
	  res.redirect(redirectLocation.pathname + redirectLocation.search);
	} else if (renderProps) {
	  const store = configureStore;
	  // const state = store.getState();

	  Promise.all([
		store.dispatch(fetchList()),
		store.dispatch(fetchItem(renderProps.params.id))
	  ])
	  .then(() => {
		// const html = renderToString(
		//   <Provider store={store}>
		// 	<RoutingContext {...renderProps} />
		//   </Provider>
		// );
	  	const html = React.createElement(Provider, { store: store }, 
	  		React.createElement(RoutingContext, renderProps )
	  	)
		res.end(renderFullPage(html, store.getState()));
	  });
	} else {
	  res.status(404).end('Not found');
	}
  });
});