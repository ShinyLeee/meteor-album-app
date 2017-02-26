import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { likeImage, unlikeImage } from '/imports/api/images/methods.js';

import { zoomerOpen, snackBarOpen } from '/imports/ui/redux/actions/index.js';
import ImageHolder from '../ImageHolder/ImageHolder.jsx';

class ImageList extends Component {

  constructor(props) {
    super(props);
    this.handleAddLiker = this.handleAddLiker.bind(this);
    this.handleRemoveLiker = this.handleRemoveLiker.bind(this);
    this.handleZoomImage = this.handleZoomImage.bind(this);
  }

  componentWillUnmount() {
    if (this.zoomPromise) {
      this.zoomPromise.cancel();
    }
  }

  handleAddLiker(image) {
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
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '发生未知错误');
      throw new Meteor.Error(err);
    });
  }

  handleRemoveLiker(image) {
    const { User } = this.props;

    unlikeImage.callPromise({
      imageId: image._id,
      unliker: User.username,
    })
    .then(() => {
      this.props.onLikeOrUnlikeAction();
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '发生未知错误');
      throw new Meteor.Error(err);
    });
  }

  handleZoomImage(image) {
    this.props.zoomerOpen(image);
    document.body.style.overflow = 'hidden';
  }

  render() {
    const { User, images } = this.props;
    return (
      <div>
        {
          images.map((image, i) => (
            <ImageHolder
              key={i}
              User={User}
              image={image}
              onLikeClick={() => this.handleAddLiker(image)}
              onUnlikeClick={() => this.handleRemoveLiker(image)}
              onMediaClick={() => this.handleZoomImage(image)}
            />
          ))
        }
      </div>
    );
  }
}

ImageList.displayName = 'ImageList';

ImageList.propTypes = {
  User: PropTypes.object,
  images: PropTypes.array.isRequired,
  onLikeOrUnlikeAction: PropTypes.func.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
  zoomerOpen: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  zoomerOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(ImageList);
