import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, Redirect } from 'react-router';
import App from '../components/App';
import Index from '../pages/Index'
import VideoClasses from '../pages/Classes/VideoClasses'
import TextClasses from '../pages/Classes/TextClasses'
import Category from '../pages/Category';

import Detail from '../pages/Detail';
//import List from '../pages/Detail/List';

import User from '../pages/User';
import NotFound from '../pages/NotFound';

const Routes = ({ history }) =>
  <Router history={history}>
    <Route path="/index" component={Index}>
    	<Redirect from="/" to="/index" />
    </Route>
    <Route path="/category/" component={Category}>
      <Route path="video/" >
      </Route>
      <Route path="text/"  />
      <Route path="test/"  />
    </Route>
    <Route path="/detail/" component={Detail}>
    </Route>
    <Route path="/user/" component={User}>
    </Route>
    {/*<Route path="/actived" component={App} />*/}
    {/*<Route path="/completed" component={App} />*/}
    <Route path="/demo" component={App}/>
    <Route path="*" component={NotFound}/>

  </Router>;

Routes.propTypes = {
  history: PropTypes.any,
};

export default Routes;
