import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Infinite from 'react-infinite';
import { likeImage, unlikeImage } from '/imports/api/images/methods';
import DataLoader from '/imports/ui/components/Loader/DataLoader';
import { zoomerOpen, snackBarOpen } from '/imports/ui/redux/actions';
import ImageHolder from '/imports/ui/components/ImageHolder';
import Tip from './Tip';

class InfiniteImageList extends PureComponent {
  static propTypes = {
    User: PropTypes.object,
    images: PropTypes.array.isRequired,
    offset: PropTypes.number,
    disabled: PropTypes.bool,
    isLoadedAll: PropTypes.bool,
    onInfiniteLoad: PropTypes.func.isRequired,
    device: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    zoomerOpen: PropTypes.func.isRequired,
  }

  static defaultProps = {
    offset: -32, // 允许再多滚动32px，因为Topbar默认64px
    disabled: false, // 是否禁止InfiniteLoad
    isLoadedAll: false, // 是否全部加载完
  }

  getImageHeights() {
    const { images, device } = this.props;
    const heights = images.map(image => {
      const imageHeight = Math.round((image.dimension[1] / image.dimension[0]) * device.width);
      return imageHeight + 152; // 80 + 52 + 20 --> title + footer + padding
    });
    return heights;
  }

  _handleToggleLike = async (like, image) => {
    const { User } = this.props;
    if (!User) {
      this.props.snackBarOpen('您还尚未登录');
    }
    try {
      const api = like ? likeImage : unlikeImage;
      const model = like
        ? { imageId: image._id, liker: User.username }
        : { imageId: image._id, unliker: User.username };
      await api.callPromise(model);
    } catch (err) {
      console.warn(err);
      const msg = like ? `点赞失败 ${err.error}` : `撤销点赞失败 ${err.error}`;
      this.props.snackBarOpen(msg);
    }
  }

  render() {
    const {
      images,
      offset,
      disabled,
      isLoadedAll,
    } = this.props;
    return [
      <Infinite
        key="Infinite__ImageList"
        elementHeight={this.getImageHeights()}
        onInfiniteLoad={this.props.onInfiniteLoad}
        loadingSpinnerDelegate={<DataLoader bottom />}
        infiniteLoadBeginEdgeOffset={disabled ? undefined : offset}
        useWindowAsScrollContainer
      >
        {
          images.map(image => (
            <ImageHolder
              key={image._id}
              image={image}
              onToggleLike={this._handleToggleLike}
              onMediaClick={this.props.zoomerOpen}
            />
          ))
        }
      </Infinite>,
      isLoadedAll && <Tip key="Infinite_Tip" />,
    ];
  }
}

const mapStateToProps = ({ sessions, device }) => ({
  device,
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  zoomerOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InfiniteImageList);
