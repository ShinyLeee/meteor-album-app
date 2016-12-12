import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';

import { makeCancelable } from '/imports/utils/utils.js';
import { Images } from '/imports/api/images/image.js';

import Infinity from '../components/Infinity.jsx';
import NavHeader from '../components/NavHeader.jsx';
import Recap from '../components/Recap.jsx';
import PicHolder from '../components/PicHolder.jsx';
import ZoomerHolder from '../components/ZoomerHolder.jsx';

const clientWidth = document.body.clientWidth;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'home',
      isLoading: false,
      images: props.images,
    };
    this.onInfinityLoad = this.onInfinityLoad.bind(this);
    this.handleAddImage = this.handleAddImage.bind(this);
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
    // If lifecyle is in componentWillUnmount,
    // But if promise still in progress then Cancel the promise
    if (this.loadPromise) {
      this.loadPromise.cancel();
    }
  }

  onInfinityLoad() {
    const { limit } = this.props;
    const { images } = this.state;
    const skip = images.length;
    const loadImage = new Promise((resolve) => {
      this.setState({ isLoading: true });
      Meteor.defer(() => {
        const loadImages = Images.find(
          { private: { $ne: true } },
          { sort: { createdAt: -1 }, limit, skip }).fetch();
        const newImages = [...images, ...loadImages];
        this.setState({ images: newImages }, () => resolve());
      });
    });

    this.loadPromise = makeCancelable(loadImage);
    this.loadPromise
      .promise
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch((err) => {
        throw new Meteor.Error(err);
      });
  }

  handleAddImage() {
    const images = this.state.images;
    const limit = this.props.limit;
    const skip = images.length;
    const loadImages = Images.find(
      { private: { $ne: true } },
      { sort: { createdAt: -1 }, limit, skip }).fetch();
    const newImages = [...images, ...loadImages];
    this.setState({ images: newImages });
    return;
  }

  renderPicHolder() {
    const images = this.state.images;
    images.map((image) => {
      const img = image;
      const users = Meteor.users.find({}).fetch();
      users.map((user) => {
        if (user._id === img.uid) {
          img.avatar = user.profile.avatar;
        }
        return img;
      });
      return img;
    });
    return images.map((image, i) => (
      <PicHolder
        key={i}
        User={this.props.User}
        image={image}
        clientWidth={clientWidth}
      />
    ));
  }

  renderInfinite() {
    return (<Infinity
      onInfinityLoad={this.onInfinityLoad}
      isLoading={this.state.isLoading}
      offsetToBottom={100}
    >
      { this.renderPicHolder() }
      <ZoomerHolder clientWidth={clientWidth} />
    </Infinity>
    );
  }

  renderLoader() {
    return (
      <div className="content text-center">
        <CircularProgress style={{ top: '150px' }} />
      </div>
    );
  }

  render() {
    const { User, dataIsReady } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} primary />
        <div className="content">
          <Recap
            title="Gallery"
            detailFir="Vivian的私人相册"
            detailSec="Created By Shiny Lee"
            showIcon
          />
          { dataIsReady ? this.renderInfinite() : this.renderLoader() }
        </div>
      </div>
    );
  }

}

Index.propTypes = {
  User: PropTypes.object,
  dataIsReady: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  limit: PropTypes.number.isRequired,
};

export default createContainer(() => {
  // Define How many pictures render in the first time
  const limit = 5;

  Meteor.subscribe('Users.allUser');
  const imageHandle = Meteor.subscribe('Images.all');
  const dataIsReady = imageHandle.ready();
  const images = Images.find(
    { private: { $ne: true } },
    { sort: { createdAt: -1 }, limit }).fetch();
  return {
    dataIsReady,
    images,
    limit,
  };
}, Index);
