import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Images } from '/imports/api/images/image';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import ZoomerHolder from '/imports/ui/components/ZoomerHolder';
import InfiniteImageList from '/imports/ui/components/Infinity/ImageList';

export default class UserLikesContent extends PureComponent {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    dataIsReady: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired, // based on isOwner render different content
    images: PropTypes.array.isRequired,
    imagesCount: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this._loadTimeout = null;
    this.state = {
      isLoading: false,
      images: props.images,
    };
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.images !== nextProps.images) {
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

  render() {
    const { dataIsReady, isOwner, imagesCount } = this.props;
    const isEmpty = this.state.images.length === 0;
    const isLoadAll = dataIsReady && this.state.images.length === imagesCount;
    return (
      <ContentLayout
        loading={!dataIsReady}
        deep={!isEmpty}
        delay
      >
        <ZoomerHolder />
        {
          isEmpty
          ? <EmptyHolder mainInfo={isOwner ? '您还未喜欢过照片' : '该用户尚未喜欢照片'} />
          : (
            <InfiniteImageList
              loading={this.state.isLoading}
              images={this.state.images}
              disabled={isLoadAll}
              onInfiniteLoad={this._handleInfiniteLoad}
            />
          )
        }
      </ContentLayout>
    );
  }
}
