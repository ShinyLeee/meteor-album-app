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

  constructor(props) {
    super(props);
    this._loadTimeout = null;
    this.state = {
      notification: false,
      images: props.images,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.imagesCount !== nextProps.imagesCount) {
      this.setState({ notification: true });
    }
  }

  componentWillUnmount() {
    if (this._loadTimeout) {
      clearTimeout(this._loadTimeout);
      this._loadTimeout = null;
    }
  }

  _handleInfiniteLoad = () => {
    const { limit } = this.props;
    const { images } = this.state;
    const skip = images.length;

    this._loadTimeout = setTimeout(() => {
      const newImages = Images.find(
        { private: false, deletedAt: null },
        { sort: { createdAt: -1 }, limit, skip },
      ).fetch();
      this.setState((prevState) => ({
        images: [...prevState.images, ...newImages],
      }));
    }, 300);
  }

  _handleRefreshImages = () => {
    scrollTo(0, 1500, () => {
      const { limit } = this.props;
      const newImages = Images.find(
        { private: false, deletedAt: null },
        { sort: { createdAt: -1 }, limit },
      ).fetch();
      this.setState({
        notification: false,
        images: newImages,
      });
    });
  }

  render() {
    const { imagesCount } = this.props;
    const isLoadAll = this.state.images.length === imagesCount;
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
        disabled={isLoadAll}
        onInfiniteLoad={this._handleInfiniteLoad}
      />,
      <ZoomerHolder key="ZoomerHolder" />,
    ];
  }
}
