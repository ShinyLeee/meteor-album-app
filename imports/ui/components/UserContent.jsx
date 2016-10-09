import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Database Model
import { Images } from '../../api/images/image.js';

import PicHolder from '../components/PicHolder.jsx';

class UserContent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: 'UserContent',
    };
  }

  renderPicHolder() {
    const filteredImages = this.props.images;
    return filteredImages.map((image) => <PicHolder key={image._id} image={image} />);
  }

  render() {
    return (
      <div className="user-content">
        {this.renderPicHolder()}
      </div>
    );
  }

}

UserContent.propTypes = {
  images: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('images');
  return {
    images: Images.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, UserContent);
