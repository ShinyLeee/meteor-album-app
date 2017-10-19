import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { Images } from '/imports/api/images/image';
import { makeCancelable } from '/imports/utils';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import SlideTransition from '/imports/ui/components/Transition/Slide';
import Infinity from '/imports/ui/components/Infinity';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import ZoomerHolder from '/imports/ui/components/ZoomerHolder';
import ImageList from '/imports/ui/components/ImageList';

export default class UserLikesContent extends PureComponent {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    dataIsReady: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired, // based on isOwner render different content
    initUserLikedImages: PropTypes.array.isRequired,
    zoomerOpen: PropTypes.bool.isRequired,
    zoomerImage: PropTypes.object, // zoomerImage only required when zoomerOpen is true
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isLoading: false,
    images: this.props.initUserLikedImages,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initUserLikedImages !== nextProps.initUserLikedImages) {
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
          { sort: { createdAt: -1 }, limit, skip },
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
        this.props.snackBarOpen(`加载图片失败 ${err.reason}`);
      });
  }

  _handleRefreshImages = () => {
    // after like or unlike a image, we need to refresh the data
    const refreshedImages = Images.find(
      { private: false },
      { sort: { createdAt: -1 }, limit: this.state.images.length },
    ).fetch();
    this.setState({ images: refreshedImages });
  }

  render() {
    const { isOwner, dataIsReady } = this.props;
    const isEmpty = this.state.images.length === 0;
    return (
      <ContentLayout loading={!dataIsReady} deep={!isEmpty}>
        {
          dataIsReady && (
            <div className="content__userLiked">
              <TransitionGroup>
                {
                  this.props.zoomerOpen && (
                    <SlideTransition>
                      <ZoomerHolder image={this.props.zoomerImage} />
                    </SlideTransition>
                  )
                }
              </TransitionGroup>
              {
                isEmpty
                ? <EmptyHolder mainInfo={isOwner ? '您还未喜欢过照片' : '该用户尚未喜欢照片'} />
                : (
                  <Infinity
                    isLoading={this.state.isLoading}
                    onInfinityLoad={this._handleLoadImages}
                    offsetToBottom={100}
                  >
                    <ImageList
                      images={this.state.images}
                      onLikeOrUnlikeAction={this._handleRefreshImages}
                    />
                  </Infinity>
                )
              }
            </div>
          )
        }
      </ContentLayout>
    );
  }
}
