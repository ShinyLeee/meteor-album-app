import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';

import { Card, CardHeader, CardActions, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import EmptyHeartIcon from 'material-ui/svg-icons/action/favorite-border';
import ReplyIcon from 'material-ui/svg-icons/content/reply';
import CommentIcon from 'material-ui/svg-icons/communication/chat-bubble-outline';

import { makeCancelable } from '/imports/utils/utils.js';
import { likeImage, unlikeImage } from '/imports/api/images/methods.js';

import { zoomerOpen, snackBarOpen } from '../actions/actionTypes.js';

const domain = Meteor.settings.public.domain;

const styles = {
  cardContainer: {
    marginBottom: '50px',
  },
  cardMedia: {
    cursor: 'zoom-in',
  },
  mediaImage: {
    maxWidth: '100%',
    minWidth: '100%',
    width: '100%',
  },
  flipReplyStyle: {
    MozTransform: 'scaleX(-1)',
    WebkitTransform: 'scaleX(-1)',
    OTransform: 'scaleX(-1)',
    transform: 'scaleX(-1)',
  },
};

class PicHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoomer: false,
    };
    this.handleAddLike = this.handleAddLike.bind(this);
    this.handleRemoveLike = this.handleRemoveLike.bind(this);
    this.handleForbidden = this.handleForbidden.bind(this);
    this.handleZoomImage = this.handleZoomImage.bind(this);
  }

  componentWillUnmount() {
    if (this.zoomPromise) {
      this.zoomPromise.cancel();
    }
  }

  handleAddLike() {
    const { User, image, dispatch } = this.props;

    const imageId = image._id;
    const liker = User._id;

    likeImage.call({
      imageId,
      liker,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen(err.message));
        return false;
      }
      return true;
    });
  }

  handleRemoveLike() {
    const { User, image, dispatch } = this.props;

    const imageId = image._id;
    const unliker = User._id;

    unlikeImage.call({
      imageId,
      unliker,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen(err.message));
        return false;
      }
      return true;
    });
  }

  handleForbidden() {
    const { dispatch } = this.props;
    dispatch(snackBarOpen('您不拥有此权限'));
  }

  handleZoomImage(image) {
    const { dispatch } = this.props;
    const zoomImage = new Promise((resolve) => {
      this.setState({ zoomer: true }, resolve);
    });

    this.zoomPromise = makeCancelable(zoomImage);
    this.zoomPromise
      .promise
      .then(() => {
        dispatch(zoomerOpen(image));
      })
      .then(() => {
        document.body.style.overflow = 'hidden';
      })
      .catch((err) => console.log(err)); // eslint-disable-line no-console
  }

  renderLikeIcon() {
    const { User, image } = this.props;

    /**
     * Default:
     * If User is login but not liked the pic, return EmptyHeartIcon, click wll add like
     *
     * If User is in Guest status, click return warning 'forbidden'
     *
     * If User is login and liked the pic, click will remove like
    */
    let LikeOrUnlikeBtn = (
      <IconButton key={'addLikeIcon'} onTouchTap={this.handleAddLike}>
        <EmptyHeartIcon />
      </IconButton>
    );

    if (!User) {
      LikeOrUnlikeBtn = (
        <IconButton key={'addLikeIcon'} onTouchTap={this.handleForbidden}>
          <EmptyHeartIcon />
        </IconButton>
      );
      return LikeOrUnlikeBtn;
    }

    const likers = image.liker;
    const curUser = User._id;

    likers.map((liker) => {
      if (liker === curUser) {
        LikeOrUnlikeBtn = (
          <IconButton
            key={'removeLikeIcon'}
            onTouchTap={this.handleRemoveLike}
            iconStyle={{ color: '#f15151' }}
          >
            <HeartIcon />
          </IconButton>
        );
      }
      return false;
    });

    return LikeOrUnlikeBtn;
  }

  render() {
    const { clientWidth, image } = this.props;
    const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const src = `${url}?imageView2/0/w/${clientWidth * 2}`;
    return (
      <div className="pic-holder">
        <Card containerStyle={styles.cardContainer}>
          <CardHeader
            title={image.user}
            subtitle={moment(image.createdAt).format('YYYY-MM-DD')}
            avatar={image.avatar}
            onTouchTap={() => browserHistory.push(`/user/${image.user}`)}
          />
          <ReactCSSTransitionGroup
            key={image.id}
            transitionName="fade"
            transitionAppear
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}
          >
            <CardMedia
              mediaStyle={styles.cardMedia}
              onTouchTap={() => this.handleZoomImage(image)}
            >
              <LazyLoad height={200} offset={200} once>
                <img style={styles.mediaImage} src={src} alt={image.name} />
              </LazyLoad>
            </CardMedia>
          </ReactCSSTransitionGroup>
          <CardActions>
            { this.renderLikeIcon() }
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
  clientWidth: PropTypes.number.isRequired,
  image: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(PicHolder);
