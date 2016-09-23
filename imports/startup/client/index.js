import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import renderRoutes from './routes.jsx';

Meteor.startup(() => {
  // i18n.setLocale(utils.language()); // SOME ERROR HERE
  render(renderRoutes(), document.getElementById('app'));
});
