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

  state = {
    images: this.props.images,
  }

  componentWillMount() {
    if (this.props.imagesCount > 0) {
      ViewLayout.setRootBackgroundColor(true);
    }
  }

  _handleInfiniteLoad = () => {
    const { limit, isOwner } = this.props;
    const skip = this.state.images.length;

    const imageSelector = { deletedAt: null };

    if (!isOwner) {
      imageSelector.private = false;
    }

    const newImages = Images.find(
      imageSelector,
      { sort: { createdAt: -1 }, limit, skip },
    ).fetch();
    this.setState((prevState) => ({
      images: [...prevState.images, ...newImages],
    }));
  }

  render() {
    const { isOwner, imagesCount } = this.props;
    const isEmpty = this.state.images.length === 0;
    const isLoadedAll = this.state.images.length === imagesCount;
    const disabled = isEmpty || isLoadedAll;
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
            disabled={disabled}
            isLoadedAll={isLoadedAll}
            onInfiniteLoad={this._handleInfiniteLoad}
          />
        ),
    ];
  }
}
