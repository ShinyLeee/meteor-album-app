import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import { Meteor } from 'meteor/meteor';
// import { createContainer } from 'meteor/react-meteor-data';

import Recap from '../partial/Recap.jsx';
import PicHolder from '../partial/PicHolder.jsx';


export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isClick: false,
    };
  }

  render() {
    return (
      <div className="content">
        <Recap />
        <PicHolder />
        <PicHolder />
      </div>
    );
  }

}

Index.propTypes = {
};
