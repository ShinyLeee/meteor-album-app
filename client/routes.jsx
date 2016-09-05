import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// route components
import App from '../imports/ui/App.jsx';
import Index from '../imports/ui/layouts/Index.jsx';
import Publish from '../imports/ui/layouts/Publish.jsx';
import NotFound from '../imports/ui/lib/NotFound.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="publish" component={Publish} />
      <Route path="404" component={NotFound} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
