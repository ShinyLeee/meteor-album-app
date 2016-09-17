import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
// import ReactDOM from 'react-dom';

// Database Model
import { Images } from '../../api/Images.js';

import Recap from '../partial/Recap.jsx';
import PicHolder from '../partial/PicHolder.jsx';

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'Index',
    };
  }

  renderPicHolder() {
    const filteredImages = this.props.images;
    return filteredImages.map((image) => {
      console.log(image);
      return (
        <PicHolder
          key={image._id}
          image={image}
        />
      );
    });
  }

  render() {
    return (
      <div className="content">
        <Recap />
        {this.renderPicHolder()}
      </div>
    );
  }

}

Index.propTypes = {
  images: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('images');
  return {
    images: Images.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, Index);
