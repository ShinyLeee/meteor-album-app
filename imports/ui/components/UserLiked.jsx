import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import CircularProgress from 'material-ui/CircularProgress';

import { Images } from '/imports/api/images/image.js';

import PicHolder from '../components/PicHolder.jsx';

class UserLiked extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'UserLiked',
    };
  }

  renderPicHolder() {
    const { images, User, otherUsers } = this.props;
    return images.map((image) => otherUsers.map((user) => {
      if (image.uid === user._id) {
        const img = image;
        img.username = user.username;
        img.avatar = user.profile.avatar;
        return <PicHolder key={image._id} User={User} image={img} />;
      }
      return false;
    }));
  }

  render() {
    if (!this.props.dataIsReady) {
      return (
        <div className="text-center">
          <CircularProgress />
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
  User: PropTypes.object.isRequired,
  otherUsers: PropTypes.array,
};

export default createContainer(() => {
  const imageHandle = Meteor.subscribe('Images.likedImages');
  const dataIsReady = imageHandle.ready();
  const images = Images.find({}, { sort: { createdAt: -1 } }).fetch();
  return {
    dataIsReady,
    images,
  };
}, UserLiked);
