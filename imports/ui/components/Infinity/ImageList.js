import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Infinite from 'react-infinite';
import { likeImage, unlikeImage } from '/imports/api/images/methods';
import DataLoader from '/imports/ui/components/Loader/DataLoader';
import { zoomerOpen, snackBarOpen } from '/imports/ui/redux/actions';
import { vWidth } from '/imports/utils/responsive';
import ImageHolder from '/imports/ui/components/ImageHolder';

class InfiniteImageList extends PureComponent {
  static propTypes = {
    User: PropTypes.object,
    images: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    onInfiniteLoad: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    zoomerOpen: PropTypes.func.isRequired,
  }

  static defaultProps = {
    loading: false,
    disabled: false,
  }

  getImageHeights() {
    const heights = this.props.images.map(image => {
      const imageHeight = Math.round((image.dimension[1] / image.dimension[0]) * vWidth);
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
      const msg = like ? `点赞失败 ${err.reason}` : `撤销点赞失败 ${err.reason}`;
      this.props.snackBarOpen(msg);
    }
  }

  render() {
    const { loading, images, disabled } = this.props;
    return [
      <Infinite
        key="Infinite__ImageList"
        isInfiniteLoading={loading}
        elementHeight={this.getImageHeights()}
        onInfiniteLoad={this.props.onInfiniteLoad}
        loadingSpinnerDelegate={<DataLoader bottom />}
        infiniteLoadBeginEdgeOffset={disabled ? undefined : -360}
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
      disabled && <div key="Infinite__bottom" className="bottom">已经到底部啦</div>,
    ];
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  zoomerOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InfiniteImageList);
