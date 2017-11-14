import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import Recap from '/imports/ui/components/Recap';
import ZoomerHolder from '/imports/ui/components/ZoomerHolder';
import InfiniteImageList from '/imports/ui/components/Infinity/ImageList';
import Notification from '/imports/ui/components/Notification';
import { Images } from '/imports/api/images/image';
import scrollTo from '/imports/vendor/scrollTo';

export default class IndexContent extends Component {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    dataIsReady: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    imagesCount: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this._loadTimeout = null;
    this.state = {
      notification: false,
      isLoading: false,
      images: props.images,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.dataIsReady && nextProps.dataIsReady) {
      this.setState({ images: nextProps.images });
    }
    if (
      this.props.dataIsReady &&
      this.props.imagesCount !== nextProps.imagesCount
    ) {
      this.setState({ notification: true });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.dataIsReady !== nextProps.dataIsReady ||
    this.state.notification !== nextState.notification ||
    this.state.isLoading !== nextState.isLoading ||
    this.state.images !== nextState.images;
  }

  componentWillUnmount() {
    if (this._loadTimeout) {
      clearTimeout(this._loadTimeout);
      this._loadTimeout = null;
    }
  }

  _handleInfiniteLoad = () => {
    this.setState({ isLoading: true });

    const { limit } = this.props;
    const { images } = this.state;
    const skip = images.length;

    this._loadTimeout = setTimeout(() => {
      const newImages = Images.find(
        { private: false, deletedAt: null },
        { sort: { createdAt: -1 }, limit, skip },
      ).fetch();
      this.setState((prevState) => ({
        isLoading: false,
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
    const {
      dataIsReady,
      imagesCount,
    } = this.props;
    const isLoadAll = dataIsReady && this.state.images.length === imagesCount;
    return (
      <ContentLayout
        loading={!dataIsReady}
        delay
      >
        <Notification
          visible={this.state.notification}
          message="内容有更新"
          onClick={this._handleRefreshImages}
        />
        <Recap
          title="Gallery"
          detailFir="Vivian的私人相册"
          detailSec="Created By Shiny Lee"
          showIcon
        />
        <InfiniteImageList
          loading={this.state.isLoading}
          images={this.state.images}
          disabled={isLoadAll}
          onInfiniteLoad={this._handleInfiniteLoad}
        />
        <ZoomerHolder />
      </ContentLayout>
    );
  }
}
