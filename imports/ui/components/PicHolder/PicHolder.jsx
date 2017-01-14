import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Card, CardHeader, CardActions, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import EmptyHeartIcon from 'material-ui/svg-icons/action/favorite-border';
import ReplyIcon from 'material-ui/svg-icons/content/reply';
import CommentIcon from 'material-ui/svg-icons/communication/chat-bubble-outline';
import { makeCancelable } from '/imports/utils/utils.js';
import { likeImage, unlikeImage } from '/imports/api/images/methods.js';

import { zoomerOpen, snackBarOpen } from '../../redux/actions/index.js';

const domain = Meteor.settings.public.domain;

const formatter = buildFormatter(CNStrings);

const styles = {
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
    this.handlePrompt = this.handlePrompt.bind(this);
    this.handleAddLiker = this.handleAddLiker.bind(this);
    this.handleRemoveLiker = this.handleRemoveLiker.bind(this);
    this.handleForbidden = this.handleForbidden.bind(this);
    this.handleZoomImage = this.handleZoomImage.bind(this);
  }

  componentWillUnmount() {
    if (this.zoomPromise) {
      this.zoomPromise.cancel();
    }
  }

  handlePrompt() {
    const { dispatch } = this.props;
    dispatch(snackBarOpen('功能开发中'));
  }

  handleAddLiker() {
    const { User, image, onLikeOrUnlikeAction, dispatch } = this.props;

    const imageId = image._id;
    const liker = User._id;

    likeImage.call({
      imageId,
      liker,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen(err.message));
      }
      onLikeOrUnlikeAction();
    });
  }

  handleRemoveLiker() {
    const { User, image, onLikeOrUnlikeAction, dispatch } = this.props;

    const imageId = image._id;
    const unliker = User._id;

    unlikeImage.call({
      imageId,
      unliker,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen(err.message));
      }
      onLikeOrUnlikeAction();
    });
  }

  handleForbidden() {
    this.props.dispatch(snackBarOpen('您还未登录'));
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
    const likers = image.liker;
    const curUser = User && User._id;
    return likers.indexOf(curUser) > -1
            ? (
              <IconButton
                key={'removeLikeIcon'}
                onTouchTap={this.handleRemoveLiker}
                iconStyle={{ color: '#f15151' }}
              >
                <HeartIcon />
              </IconButton>)
            : (
              <IconButton
                key={'addLikeIcon'}
                onTouchTap={User ? this.handleAddLiker : this.handleForbidden}
              >
                <EmptyHeartIcon />
              </IconButton>);
  }

  render() {
    const { clientWidth, image } = this.props;
    const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const src = `${url}?imageView2/0/w/${clientWidth * 2}`;
    return (
      <div className="pic-holder">
        <Card>
          <CardHeader
            title={image.user}
            subtitle={<TimeAgo date={image.createdAt} formatter={formatter} />}
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
            <IconButton onTouchTap={this.handlePrompt}>
              <CommentIcon />
            </IconButton>
            <IconButton onTouchTap={this.handlePrompt} iconStyle={styles.flipReplyStyle}>
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
  onLikeOrUnlikeAction: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(PicHolder);
