import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import { Card, CardHeader, CardActions, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import EmptyHeartIcon from 'material-ui/svg-icons/action/favorite-border';
import ReplyIcon from 'material-ui/svg-icons/content/reply';
import CommentIcon from 'material-ui/svg-icons/communication/chat-bubble-outline';

import displayAlert from '../lib/displayAlert.js';
import { likeImage } from '../../api/images/methods.js';

export default class PicHolder extends Component {

  constructor(props) {
    super(props);
    this.handleAddLike = this.handleAddLike.bind(this);
    this.handleZoomImage = this.handleZoomImage.bind(this);
    this.handleForbidden = this.handleForbidden.bind(this);
    this.hasLiked = this.hasLiked.bind(this);
  }

  handleAddLike() {
    const { User, image } = this.props;

    const imageId = image._id;
    const liker = User.username;

    likeImage.call({
      imageId,
      liker,
    }, (err) => {
      if (err) {
        displayAlert('error', err.message);
        return false;
      }
      return true;
    });
  }

  handleZoomImage() {
    console.log('in');
  }

  handleForbidden() {
    displayAlert('warning', 'image.like.forbidden');
  }

  hasLiked() {
    const { User, image } = this.props;

    if (!User) {
      return (
        <IconButton
          key={2}
          onTouchTap={this.handleForbidden}
        >
          <EmptyHeartIcon />
        </IconButton>);
    }

    const likers = image.liker;
    const curUser = User.username;

    if (likers.length === 0) {
      return (
        <IconButton
          key={2}
          onTouchTap={this.handleAddLike}
        >
          <EmptyHeartIcon />
        </IconButton>);
    }

    /* eslint no-confusing-arrow: 0 */
    return likers.map((liker) => (
      liker === curUser ?
        <IconButton
          key={1}
          iconStyle={{ color: '#f15151' }}
        >
          <HeartIcon />
        </IconButton> :
        <IconButton
          key={2}
          onTouchTap={this.handleAddLike}
        >
          <EmptyHeartIcon />
        </IconButton>
    ));
  }

  render() {
    const { image } = this.props;
    const styles = {
      cardContainer: {
        marginBottom: '50px',
      },
      flipReplyStyle: {
        MozTransform: 'scaleX(-1)',
        WebkitTransform: 'scaleX(-1)',
        OTransform: 'scaleX(-1)',
        transform: 'scaleX(-1)',
      },
    };
    return (
      <div className="pic-holder">
        <Card containerStyle={styles.cardContainer}>
          <CardHeader
            title={image.username}
            subtitle={moment(image.createdAt).format('YYYY-MM-DD')}
            avatar={image.avatar}
          />
          <CardMedia onTouchTap={this.handleZoomImage}>
            <img src={image.url} alt={image.name} />
          </CardMedia>
          <CardActions>
            { this.hasLiked() }
            <IconButton>
              <CommentIcon />
            </IconButton>
            <IconButton iconStyle={styles.flipReplyStyle}>
              <ReplyIcon />
            </IconButton>
          </CardActions>
        </Card>
      </div>
    );
  }
}

PicHolder.propTypes = {
  User: PropTypes.object,
  image: PropTypes.object.isRequired,
};
