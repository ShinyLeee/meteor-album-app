import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';

// Database Model
import { Images } from '../../api/images/image.js';

import NavHeader from '../components/NavHeader.jsx';
import Recap from '../components/Recap.jsx';
import PicHolder from '../components/PicHolder.jsx';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'home',
    };
  }

  renderPicHolder() {
    const filteredImages = this.props.images;
    return filteredImages.map((image) => <PicHolder key={image._id} image={image} />);
  }

  render() {
    const { User, dataIsReady, isGuest } = this.props;
    if (!dataIsReady) {
      return (
        <div className="container">
          <NavHeader location={this.state.location} />
          <div className="content text-center">
            <CircularProgress style={{ top: '150px' }} size={1} />
          </div>
        </div>
      );
    }
    if (isGuest) {
      return (
        <div className="container">
          <NavHeader
            location={this.state.location}
          />
          <div className="content">
            <Recap
              title="Gallery"
              detailFir="Vivian的私人相册"
              detailSec="Created By Shiny Lee"
            />
            {this.renderPicHolder()}
          </div>
        </div>
      );
    }
    return (
      <div className="container">
        <NavHeader
          User={User}
          location={this.state.location}
        />
        <div className="content">
          <Recap
            title="Gallery"
            detailFir="Vivian的私人相册"
            detailSec="Created By Shiny Lee"
          />
          {this.renderPicHolder()}
        </div>
      </div>
    );
  }

}

Index.propTypes = {
  isGuest: PropTypes.bool.isRequired,
  dataIsReady: PropTypes.bool.isRequired,
  User: PropTypes.object,
  images: PropTypes.array.isRequired,
};

// If contextTypes is not defined, then context will be an empty object.
Index.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default createContainer(() => {
  let isGuest;
  let dataIsReady;
  const User = Meteor.user();
  const imageHandle = Meteor.subscribe('Images.all');
  const images = Images.find({}, { sort: { createdAt: -1 } }).fetch();
  if (typeof User === 'undefined' || User) {
    isGuest = false;
    dataIsReady = imageHandle.ready() && !!User;
  } else {
    isGuest = true;
    dataIsReady = imageHandle.ready();
  }
  return {
    User,
    images,
    dataIsReady,
    isGuest,
  };
}, Index);
