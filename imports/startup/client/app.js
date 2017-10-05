import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import App_Mobile from '/imports/ui/App';
import App_PC from '/imports/ui/App_PC';
import { platform } from '/imports/utils';

const RootApp = platform().mobile ? App_Mobile : App_PC;

// This is Use of Disabling User zooming the Page in IOS10
const noScalable = () => {
  document.documentElement.addEventListener('touchstart', (evt) => {
    if (evt.touches.length > 1) {
      evt.preventDefault();
    }
  }, false);

  let lastTouchEnd = 0;
  document.documentElement.addEventListener('touchend', (evt) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      evt.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};

Meteor.startup(() => {
  noScalable();
  render(<RootApp />, document.getElementById('app'));
});
