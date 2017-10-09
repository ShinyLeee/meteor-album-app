import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { likeImage, unlikeImage } from '/imports/api/images/methods.js';

import { zoomerOpen, snackBarOpen } from '/imports/ui/redux/actions';
import ImageHolder from '../ImageHolder';

class ImageList extends Component {
  static propTypes = {
    User: PropTypes.object,
    images: PropTypes.array.isRequired,
    onLikeOrUnlikeAction: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    zoomerOpen: PropTypes.func.isRequired,
  }

  componentWillUnmount() {
    if (this.zoomPromise) {
      this.zoomPromise.cancel();
    }
  }

  _handleAddLiker = (image) => {
    const { User } = this.props;

    if (!User) {
      this.props.snackBarOpen('您还尚未登录');
      return;
    }
    likeImage.callPromise({
      imageId: image._id,
      liker: User.username,
    })
    .then(() => {
      this.props.onLikeOrUnlikeAction();
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(err.reason || '发生未知错误');
    });
  }

  _handleRemoveLiker = (image) => {
    const { User } = this.props;

    unlikeImage.callPromise({
      imageId: image._id,
      unliker: User.username,
    })
    .then(() => {
      this.props.onLikeOrUnlikeAction();
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(err.reason || '发生未知错误');
    });
  }

  _handleZoomImage = (image) => {
    this.props.zoomerOpen(image);
    document.body.style.overflow = 'hidden';
  }

  render() {
    const { images } = this.props;
    return (
      <div>
        {
          images.map((image, i) => (
            <ImageHolder
              key={i}
              image={image}
              onLikeClick={this._handleAddLiker}
              onUnlikeClick={this._handleRemoveLiker}
              onMediaClick={this._handleZoomImage}
            />
          ))
        }
      </div>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  zoomerOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ImageList);
