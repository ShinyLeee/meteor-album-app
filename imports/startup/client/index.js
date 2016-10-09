import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import renderRoutes from './routes.jsx';

Meteor.startup(() => {
  // i18n.setLocale(utils.language()); // SOME ERROR HERE
  injectTapEventPlugin();
  render(renderRoutes(), document.getElementById('app'));
});
