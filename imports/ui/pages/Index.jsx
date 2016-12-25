import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';
import { makeCancelable } from '/imports/utils/utils.js';
import { Images } from '/imports/api/images/image.js';
import { Notes } from '/imports/api/notes/note.js';
import Infinity from '../components/Infinity.jsx';
import NavHeader from '../components/NavHeader.jsx';
import Recap from '../components/Recap.jsx';
import PicHolder from '../components/PicHolder.jsx';
import ZoomerHolder from '../components/ZoomerHolder.jsx';

const clientWidth = document.body.clientWidth;

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'explore',
      isLoading: false,
      images: props.initialImages,
    };
    this.handleLoadImages = this.handleLoadImages.bind(this);
    this.handleRefreshImages = this.handleRefreshImages.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // When dataIsReady return true start setState
    if (nextProps.dataIsReady) {
      this.setState({
        images: nextProps.initialImages,
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

  handleLoadImages() {
    const { limit } = this.props;
    const { images } = this.state;
    const skip = images.length;
    this.setState({ isLoading: true });
    const loadPromise = new Promise((resolve) => {
      Meteor.defer(() => {
        const newImages = Images.find(
          { private: { $ne: true } },
          { sort: { createdAt: -1 }, limit, skip }).fetch();
        const curImages = [...images, ...newImages];
        this.setState({ images: curImages }, () => resolve());
      });
    });

    this.loadPromise = makeCancelable(loadPromise);
    this.loadPromise
      .promise
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch((err) => {
        throw new Meteor.Error(err);
      });
  }

  handleRefreshImages() {
    // after like or unlike a image, we need to refresh the data
    const trueImages = Images.find(
      { private: { $ne: true } },
      { sort: { createdAt: -1 }, limit: this.state.images.length }).fetch();
    this.setState({ images: trueImages });
  }

  renderPicHolder() {
    const { users } = this.props;
    const images = this.state.images;
    images.forEach((image) => {
      const img = image;
      users.forEach((user) => {
        if (user._id === img.uid) {
          img.avatar = user.profile.avatar;
        }
      });
    });
    return images.map((image, i) => (
      <PicHolder
        key={i}
        User={this.props.User}
        image={image}
        clientWidth={clientWidth}
        onLikeOrUnlikeAction={this.handleRefreshImages}
      />
    ));
  }

  renderInfinite() {
    return (
      <div className="index">
        <Infinity
          onInfinityLoad={this.handleLoadImages}
          isLoading={this.state.isLoading}
          offsetToBottom={100}
        >
          { this.renderPicHolder() }
          <ZoomerHolder clientWidth={clientWidth} />
        </Infinity>
      </div>
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
    const { User, noteNum, dataIsReady } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} noteNum={noteNum} primary />
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

IndexPage.propTypes = {
  User: PropTypes.object,
  dataIsReady: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  initialImages: PropTypes.array.isRequired,
  noteNum: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
};

export default createContainer(() => {
  // Define How many pictures render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.all');
  const imageHandler = Meteor.subscribe('Images.all');
  const noteHandler = Meteor.subscribe('Notes.own');
  const dataIsReady = userHandler.ready() && imageHandler.ready() && noteHandler.ready();
  const users = Meteor.users.find().fetch();
  const initialImages = Images.find(
    { private: { $ne: true } },
    { sort: { createdAt: -1 }, limit }).fetch();
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  return {
    dataIsReady,
    users,
    initialImages,
    noteNum,
    limit,
  };
}, IndexPage);
