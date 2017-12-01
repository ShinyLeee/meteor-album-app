import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ZoomerHolder from '/imports/ui/components/ZoomerHolder';
import InfiniteImageList from '/imports/ui/components/Infinity/ImageList';
import Notification from '/imports/ui/components/Notification';
import { Images } from '/imports/api/images/image';
import scrollTo from '/imports/vendor/scrollTo';

export default class IndexContent extends PureComponent {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    images: PropTypes.array.isRequired,
    imagesCount: PropTypes.number.isRequired,
  }

  state = {
    notification: false,
    images: this.props.images,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.imagesCount !== nextProps.imagesCount) {
      this.setState({ notification: true });
    }
  }

  _handleInfiniteLoad = () => {
    const { limit } = this.props;
    const skip = this.state.images.length;

    const newImages = Images.find(
      { private: false, deletedAt: null },
      { sort: { createdAt: -1 }, limit, skip },
    ).fetch();
    this.setState((prevState) => ({
      images: [...prevState.images, ...newImages],
    }));
  }

  _handleRefreshImages = () => {
    const refreshImage = () => {
      const { limit } = this.props;
      const newImages = Images.find(
        { private: false, deletedAt: null },
        { sort: { createdAt: -1 }, limit },
      ).fetch();
      this.setState({
        notification: false,
        images: newImages,
      });
    };
    scrollTo(0, 1500, refreshImage);
  }

  render() {
    const { imagesCount } = this.props;
    const isLoadedAll = this.state.images.length === imagesCount;
    const disabled = this.state.images.length === 0 || isLoadedAll;
    return [
      <Notification
        key="Notification"
        visible={this.state.notification}
        message="内容有更新"
        onClick={this._handleRefreshImages}
      />,
      <InfiniteImageList
        key="InfiniteImageList"
        images={this.state.images}
        offset={-48} // 32 + 316 二分之一Topbar + Recap
        disabled={disabled}
        isLoadedAll={isLoadedAll}
        onInfiniteLoad={this._handleInfiniteLoad}
      />,
      <ZoomerHolder key="ZoomerHolder" />,
    ];
  }
}
