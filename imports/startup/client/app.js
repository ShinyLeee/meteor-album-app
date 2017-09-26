import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App_Mobile from '/imports/ui/App.jsx';
import App_PC from '/imports/ui/App_PC.jsx';
import { platform } from '/imports/utils';

const RootApp = platform().mobile ? App_Mobile : App_PC;

// This is Use of Disabling User zooming the Page in IOS10
const noScalable = () => {
  document.documentElement.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, false);

  let lastTouchEnd = 0;
  document.documentElement.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};

Meteor.startup(() => {
  noScalable();
  injectTapEventPlugin();
  render(<RootApp />, document.getElementById('app'));
});
