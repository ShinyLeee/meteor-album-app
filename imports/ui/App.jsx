import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import { Meteor } from 'meteor/meteor';
// import { createContainer } from 'meteor/react-meteor-data';

import NavHeader from './partial/NavHeader.jsx';
import Recap from './partial/Recap.jsx';
import PicHolder from './partial/PicHolder.jsx';
import NavFooter from './partial/NavFooter.jsx';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isClick: false,
    };
  }

  render() {
    return (
      <div className="container">
        <NavHeader />
        <div className="content">
          <Recap />
          <PicHolder />
          <PicHolder />
        </div>
        <NavFooter />
      </div>
    );
  }

}

App.propTypes = {
};

// export default createContainer(() => {
// }, App);
