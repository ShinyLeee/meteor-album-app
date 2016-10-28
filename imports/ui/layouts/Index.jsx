import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import LazyLoad from 'react-lazyload';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddIcon from 'material-ui/svg-icons/content/add';

import { Images } from '/imports/api/images/image.js';

import Infinity from '../components/Infinity.jsx';
import NavHeader from '../components/NavHeader.jsx';
import Recap from '../components/Recap.jsx';
import PicHolder from '../components/PicHolder.jsx';

import { makeCancelable } from '../../utils/utils.js';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'home',
      isLoading: false,
    };
    this.handleAddImage = this.handleAddImage.bind(this);
    this.onInfinityLoad = this.onInfinityLoad.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // When dataIsReady return true start setState
    if (nextProps.dataIsReady) {
      this.setState({
        images: nextProps.images,
      });
    }
  }

  componentWillUnmount() {
    if (this.loadTimeout) {
      this.loadTimeout.cancel(); // Cancel the promise
    }
  }

  onInfinityLoad() {
    const loadImage = new Promise((resolve) => {
      this.setState({ isLoading: true });
      setTimeout(this.handleAddImage, 1500);
      setTimeout(resolve, 1500);
    });

    this.loadTimeout = makeCancelable(loadImage);
    this.loadTimeout
      .promise
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch((err) => console.log(err));
  }

  handleAddImage() {
    const images = this.state.images;
    const limit = this.props.limit;
    const skip = images.length;
    const tempImg = Images.find({}, {
      sort: { createdAt: -1 },
      limit,
      skip,
    }).fetch();
    tempImg.map((image) => images.push(image));
    return;
  }

  renderPicHolder() {
    const images = this.state.images;
    /**
     * Get the Image Uploader's
     * name and avatar url
     */
    images.map((image) => {
      const img = image;
      const users = Meteor.users.find({}).fetch();
      users.map((user) => {
        if (user._id === img.uid) {
          img.username = user.username;
          img.avatar = user.profile.avatar;
        }
        return img;
      });
      return img;
    });
    return images.map((image) => (
      <LazyLoad key={image._id} height={200} offset={100} once>
        <PicHolder User={this.props.User} image={image} />
      </LazyLoad>
    ));
  }

  renderInfinite() {
    return (<Infinity
      onInfinityLoad={this.onInfinityLoad}
      isLoading={this.state.isLoading}
    >
      {this.renderPicHolder()}
    </Infinity>
    );
  }

  render() {
    const { User, dataIsReady, isGuest } = this.props;
    if (!dataIsReady) {
      return (
        <div className="container">
          <NavHeader
            User={User}
            location={this.state.location}
          />
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
            {this.renderInfinite()}
          </div>
        </div>
      );
    }
    const styles = {
      floatBtn: {
        position: 'fixed',
        right: '16px',
        bottom: '16px',
      },
    };
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
          {this.renderInfinite()}
        </div>
        <FloatingActionButton
          style={styles.floatBtn}
          containerElement={<Link to="/upload" />}
          secondary
        >
          <AddIcon />
        </FloatingActionButton>
      </div>
    );
  }

}

Index.propTypes = {
  isGuest: PropTypes.bool.isRequired,
  dataIsReady: PropTypes.bool.isRequired,
  User: PropTypes.object,
  images: PropTypes.array.isRequired,
  limit: PropTypes.number.isRequired,
};

// If contextTypes is not defined, then context will be an empty object.
Index.contextTypes = {
  router: PropTypes.object.isRequired,
};


export default createContainer(() => {
  // Define How much picture render in the first time
  const limit = 5;

  let isGuest;
  let dataIsReady;
  Meteor.subscribe('Users.allUser');
  const User = Meteor.user();
  const imageHandle = Meteor.subscribe('Images.all');
  const images = Images.find({}, {
    sort: { createdAt: -1 },
    limit,
  }).fetch();
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
    limit,
  };
}, Index);
