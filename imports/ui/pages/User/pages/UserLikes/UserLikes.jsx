import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Images } from '/imports/api/images/image.js';
import { makeCancelable } from '/imports/utils/utils.js';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Infinity from '/imports/ui/components/Infinity/Infinity.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import EmptyHolder from '/imports/ui/components/EmptyHolder/EmptyHolder.jsx';
import ZoomerHolder from '/imports/ui/components/ZoomerHolder/ZoomerHolder.jsx';
import ImageList from '/imports/ui/components/ImageList/ImageList.jsx';

export default class UserLikesPage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      images: props.initUserLikedImages,
    };
    this.handleLoadImages = this.handleLoadImages.bind(this);
    this.handleRefreshImages = this.handleRefreshImages.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // When dataIsReady return true start setState
    if (!this.props.dataIsReady && nextProps.dataIsReady) {
      this.setState({
        images: nextProps.initUserLikedImages,
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
          { private: false },
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
    const refreshedImages = Images.find(
      { private: false },
      { sort: { createdAt: -1 }, limit: this.state.images.length }
    ).fetch();
    this.setState({ images: refreshedImages });
  }

  renderContent() {
    if (this.state.images.length === 0) {
      return (
        <EmptyHolder
          mainInfo={this.props.isGuest ? '该用户尚未喜欢照片' : '您还未喜欢过照片'}
        />
      );
    }
    return (
      <div className="content__userLiked">
        <ReactCSSTransitionGroup
          transitionName="zoomer"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          { this.props.zoomerOpen && <ZoomerHolder key={this.props.zoomerImage._id} image={this.props.zoomerImage} /> }
        </ReactCSSTransitionGroup>
        <Infinity
          isLoading={this.state.isLoading}
          onInfinityLoad={this.handleLoadImages}
          offsetToBottom={100}
        >
          <ImageList
            User={this.props.User}
            images={this.state.images}
            onLikeOrUnlikeAction={this.handleRefreshImages}
          />
        </Infinity>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <NavHeader
          title={this.props.isGuest ? `${this.props.curUser.username}喜欢的` : '我喜欢的'}
          secondary
        />
        { !this.props.dataIsReady && (<Loading />) }
        <div className="content">
          { this.props.dataIsReady && this.renderContent() }
        </div>
      </div>
    );
  }

}

UserLikesPage.displayName = 'UserLikesPage';

UserLikesPage.propTypes = {
  User: PropTypes.object, // only required in only Owner page, etc.. Setting/Recycle/Note
  // Below Pass from Database
  limit: PropTypes.number.isRequired,
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired, // based on isGuest render different content
  curUser: PropTypes.object.isRequired,
  initUserLikedImages: PropTypes.array.isRequired,
  // Below Pass from Redux
  zoomerOpen: PropTypes.bool.isRequired,
  zoomerImage: PropTypes.object, // zoomerImage only required when zoomerOpen is true
};
