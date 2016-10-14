import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import CircularProgress from 'material-ui/CircularProgress';

// Database Model
import { Images } from '../../api/images/image.js';

import PicHolder from '../components/PicHolder.jsx';

class UserLiked extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'UserLiked',
    };
  }

  renderPicHolder() {
    const filteredImages = this.props.images;
    return filteredImages.map((image) => <PicHolder key={image._id} image={image} />);
  }

  render() {
    if (!this.props.dataIsReady) {
      return (
        <div className="text-center">
          <CircularProgress size={1} />
        </div>
      );
    }
    return (
      <div className="user-content">
        {this.renderPicHolder()}
      </div>
    );
  }

}

UserLiked.propTypes = {
  dataIsReady: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
};

export default createContainer(() => {
  const dataHandle = Meteor.subscribe('Images.ownImages');
  const dataIsReady = dataHandle.ready();
  const images = Images.find({}, { sort: { createdAt: -1 } }).fetch();
  return {
    dataIsReady,
    images,
  };
}, UserLiked);
