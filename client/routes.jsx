import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// route components
import App from '../imports/ui/App.jsx';
import Index from '../imports/ui/layouts/Index.jsx';
import Upload from '../imports/ui/layouts/Upload.jsx';
import NotFound from '../imports/ui/lib/NotFound.jsx';

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="upload" component={Upload} />
      <Route path="404" component={NotFound} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
