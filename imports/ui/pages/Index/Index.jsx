import React, { PureComponent, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Images } from '/imports/api/images/image.js';
import { makeCancelable } from '/imports/utils/utils.js';

import NavHeader from '../../components/NavHeader/NavHeader.jsx';
import Infinity from '../../components/Infinity/Infinity.jsx';
import Recap from '../../components/Recap/Recap.jsx';
import Loading from '../../components/Loader/Loading.jsx';
import ZoomerHolder from '../../components/ZoomerHolder/ZoomerHolder.jsx';
import ImageList from './components/ImageList/ImageList.jsx';

export default class IndexPage extends PureComponent {

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
    if (!this.props.dataIsReady && nextProps.dataIsReady) {
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
          { sort: { createdAt: -1 }, limit, skip }
        ).fetch();
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

  renderImageList() {
    const { users } = this.props;
    const images = this.state.images;
    images.forEach((image) => {
      const img = image;
      users.forEach((user) => {
        if (user.username === img.user) {
          img.avatar = user.profile.avatar;
        }
      });
    });
    return (
      <ImageList
        User={this.props.User}
        images={images}
        clientWidth={this.props.clientWidth}
        onLikeOrUnlikeAction={this.handleRefreshImages}
      />
    );
  }

  render() {
    return (
      <div className="container">
        <NavHeader
          User={this.props.User}
          location={this.state.location}
          noteNum={this.props.noteNum}
          snackBarOpen={this.props.snackBarOpen}
          primary
        />
        { !this.props.dataIsReady && (<Loading />) }
        <div className="content">
          <Recap
            title="Gallery"
            detailFir="Vivian的私人相册"
            detailSec="Created By Shiny Lee"
            showIcon
          />
          { this.props.dataIsReady && (
            <div className="content__index">
              <Infinity
                isLoading={this.state.isLoading}
                onInfinityLoad={this.handleLoadImages}
                offsetToBottom={100}
              >
                { this.renderImageList() }
                <ZoomerHolder clientWidth={this.props.clientWidth} />
              </Infinity>
            </div>
            )
          }
        </div>
      </div>
    );
  }

}

IndexPage.displayName = 'IndexPage';

IndexPage.defaultProps = {
  clientWidth: document.body.clientWidth, // for ImageList and ZoomerHolder
};

IndexPage.propTypes = {
  User: PropTypes.object,
  clientWidth: PropTypes.number.isRequired,
  // Below Pass from database
  limit: PropTypes.number.isRequired,
  dataIsReady: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  noteNum: PropTypes.number.isRequired,
  initialImages: PropTypes.array.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};
