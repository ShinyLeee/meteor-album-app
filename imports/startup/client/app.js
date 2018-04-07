import { Meteor } from 'meteor/meteor';
import { platform } from '/imports/utils';
import React from 'react';
import { render } from 'react-dom';
// import App_Mobile from '/imports/ui/App';
// import App_PC from '/imports/ui/App_PC';

// const App = platform().mobile ? App_Mobile : App_PC;

async function renderAsync() {
  const [
    // React,
    // { render },
    { default: App },
  ] = await Promise.all([
    // import('react'),
    // import('react-dom'),
    platform().mobile ? import('/imports/ui/App') : import('/imports/ui/App_PC'),
  ]);

  render(<App />, document.getElementById('app'));
}

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
  const renderStart = Date.now();
  const startupTime = renderStart - window.performance.timing.responseStart;
  console.log(`Meteor.startup took: ${startupTime}ms`);

  renderAsync().then(() => {
    const renderTime = Date.now() - renderStart;
    console.log(`renderAsync took: ${renderTime}ms`);
    console.log(`Total time: ${startupTime + renderTime}ms`);
  });
});
