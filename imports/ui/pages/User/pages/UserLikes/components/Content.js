import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Images } from '/imports/api/images/image';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import ZoomerHolder from '/imports/ui/components/ZoomerHolder';
import InfiniteImageList from '/imports/ui/components/Infinity/ImageList';

export default class UserLikesContent extends PureComponent {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    isOwner: PropTypes.bool.isRequired, // based on isOwner render different content
    images: PropTypes.array.isRequired,
    imagesCount: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this._loadTimeout = null;
    this.state = {
      images: props.images,
    };
  }

  componentWillMount() {
    if (this.props.imagesCount > 0) {
      ViewLayout.setRootBackgroundColor(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.imagesCount !== nextProps.imagesCount) {
      this.setState({
        images: nextProps.images,
      });
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
    const skip = this.state.images.length;

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

  render() {
    const { isOwner, imagesCount } = this.props;
    const isEmpty = this.state.images.length === 0;
    const isLoadAll = this.state.images.length === imagesCount;
    return [
      <ZoomerHolder key="ZoomerHolder" />,
      isEmpty
        ? (
          <EmptyHolder
            key="EmptyHolder"
            mainInfo={isOwner ? '您还未喜欢过照片' : '该用户尚未喜欢照片'}
          />
        )
        : (
          <InfiniteImageList
            key="InfiniteImageList"
            images={this.state.images}
            disabled={isLoadAll}
            onInfiniteLoad={this._handleInfiniteLoad}
          />
        ),
    ];
  }
}
