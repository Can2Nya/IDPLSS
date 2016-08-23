import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, Redirect } from 'react-router';
import App from '../components/App';
import Index from '../pages/Index'
import VideoClasses from '../pages/Classes/VideoClasses'
import TextClasses from '../pages/Classes/TextClasses'
import Classes from '../pages/Classes';
import NotFound from '../pages/NotFound';

const Routes = ({ history }) =>
  <Router history={history}>
    <Route path="/index" component={Index}>
    	<Redirect from="/" to="/index" />
    </Route>
    <Route path="/category/" component={Classes}>
      <Route path="video/" components={VideoClasses}>
      </Route>
      <Route path="text" components={TextClasses} />
    </Route>
    {/*<Route path="/actived" component={App} />*/}
    {/*<Route path="/completed" component={App} />*/}
    <Route path="*" component={NotFound}/>
  </Router>;

Routes.propTypes = {
  history: PropTypes.any,
};

export default Routes;
