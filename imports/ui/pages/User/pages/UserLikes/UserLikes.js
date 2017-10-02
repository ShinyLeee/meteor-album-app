import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Images } from '/imports/api/images/image.js';
import { makeCancelable } from '/imports/utils';
import RootLayout from '/imports/ui/layouts/RootLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import Infinity from '/imports/ui/components/Infinity';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import ZoomerHolder from '/imports/ui/components/ZoomerHolder';
import ImageList from '/imports/ui/components/ImageList';

export default class UserLikesPage extends PureComponent {
  static propTypes = {
    User: PropTypes.object, // only required in only Owner page, etc.. Setting/Recycle/Note
    limit: PropTypes.number.isRequired,
    dataIsReady: PropTypes.bool.isRequired,
    isGuest: PropTypes.bool.isRequired, // based on isGuest render different content
    curUser: PropTypes.object.isRequired,
    initUserLikedImages: PropTypes.array.isRequired,
    zoomerOpen: PropTypes.bool.isRequired,
    zoomerImage: PropTypes.object, // zoomerImage only required when zoomerOpen is true
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      images: props.initUserLikedImages,
    };
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

  _handleLoadImages = () => {
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
    this.loadPromise.promise
    .then(() => {
      this.setState({ isLoading: false });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  _handleRefreshImages = () => {
    // after like or unlike a image, we need to refresh the data
    const refreshedImages = Images.find(
      { private: false },
      { sort: { createdAt: -1 }, limit: this.state.images.length }
    ).fetch();
    this.setState({ images: refreshedImages });
  }

  renderContent() {
    const { User, zoomerOpen, zoomerImage } = this.props;
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
          { zoomerOpen && <ZoomerHolder key={zoomerImage._id} image={zoomerImage} /> }
        </ReactCSSTransitionGroup>
        <Infinity
          isLoading={this.state.isLoading}
          onInfinityLoad={this._handleLoadImages}
          offsetToBottom={100}
        >
          <ImageList
            User={User}
            images={this.state.images}
            onLikeOrUnlikeAction={this._handleRefreshImages}
          />
        </Infinity>
      </div>
    );
  }

  render() {
    const { isGuest, curUser, dataIsReady } = this.props;
    return (
      <RootLayout
        loading={!dataIsReady}
        Topbar={<SecondaryNavHeader title={isGuest ? `${curUser.username}喜欢的` : '我喜欢的'} />}
      >
        { dataIsReady && this.renderContent() }
      </RootLayout>
    );
  }

}
