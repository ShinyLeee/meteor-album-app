import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import LazyLoad from 'react-lazyload';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Card, { CardHeader, CardActions, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import HeartIcon from 'material-ui-icons/Favorite';
import EmptyHeartIcon from 'material-ui-icons/FavoriteBorder';
import CommentIcon from 'material-ui-icons/ChatBubbleOutline';
import { Comments } from '/imports/api/comments/comment.js';
import { vWidth, rWidth } from '/imports/utils/responsive';
import settings from '/imports/utils/settings';
import FadeTransition from '/imports/ui/components/Transition/Fade';
import CommentList from '/imports/ui/components/CommentList';
import { snackBarOpen } from '/imports/ui/redux/actions';
import { Wrapper, ActionButtonNum } from './ImageHolder.style.js';

const formatter = buildFormatter(CNStrings);

const { imageDomain } = settings;

class ImageHolder extends Component {
  static propTypes = {
    image: PropTypes.object.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onUnlikeClick: PropTypes.func.isRequired,
    onMediaClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    User: PropTypes.object, // not required bc guest can visit it
    comments: PropTypes.array.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {
    comments: [],
  }

  state = {
    isCommentOpen: false,
  }

  _handleMediaTouch = () => {
    this.props.onMediaClick(this.props.image);
  }

  _handleLike = () => {
    this.props.onLikeClick(this.props.image);
  }

  _handleUnlike = () => {
    this.props.onUnlikeClick(this.props.image);
  }

  render() {
    const {
      User,
      image,
      comments,
      history,
      classes,
    } = this.props;

    // get avatar src
    const imageOwner = Meteor.users.findOne({ username: image.user });
    const avatar = imageOwner && imageOwner.profile.avatar;

    // get image src
    const url = `${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`;

    // realHeight for lazyload
    const realHeight = Math.round((image.dimension[1] / image.dimension[0]) * vWidth);

    const imageSrc = `${url}?imageView2/2/w/${rWidth}`;

    const isLiked = User && image.liker.indexOf(User.username) > -1;

    return (
      <Wrapper>
        <Card>
          <CardHeader
            avatar={<Avatar src={avatar} onClick={() => history.push(`/user/${image.user}`)} />}
            title={image.user}
            subheader={<TimeAgo date={image.createdAt} formatter={formatter} />}
          />
          <LazyLoad
            height={realHeight}
            once
          >
            <TransitionGroup>
              <FadeTransition>
                <CardMedia
                  style={{ height: realHeight, backgroundColor: image.color }}
                  image={imageSrc}
                  onClick={this._handleMediaTouch}
                />
              </FadeTransition>
            </TransitionGroup>
          </LazyLoad>
          <CardActions>
            {
              isLiked
              ? (
                <IconButton
                  className={classes.heartIcon}
                  onClick={this._handleUnlike}
                ><HeartIcon />
                </IconButton>
              )
              : (
                <IconButton
                  className={classes.icon}
                  onClick={this._handleLike}
                >
                  <EmptyHeartIcon />
                  { image.liker.length > 0 && <ActionButtonNum>{image.liker.length}</ActionButtonNum> }
                </IconButton>
              )
            }
            <IconButton
              className={classes.icon}
              onClick={() => this.setState(prevState => ({ isCommentOpen: !prevState.isCommentOpen }))}
            ><CommentIcon />
            </IconButton>
            { comments.length > 0 && <ActionButtonNum>{comments.length}</ActionButtonNum> }
          </CardActions>
          <CommentList
            open={this.state.isCommentOpen}
            discId={image._id}
            comments={comments}
          />
        </Card>
      </Wrapper>
    );
  }
}

const ImageHolderContainer = createContainer(({ image }) => {
  // discussion_id from comment
  const discId = image._id;

  Meteor.subscribe('Comments.inImage', discId);

  const comments = Comments.find(
    { discussion_id: discId, type: 'image' },
    { sort: { createdAt: -1 } }
  ).fetch();

  return {
    comments,
  };
}, ImageHolder);

const mapStateToProps = (state) => ({
  User: state.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

const styles = {
  icon: {
    color: 'rgba(0, 0, 0, 0.87)',
  },

  heartIcon: {
    color: '#f15151',
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withRouter,
)(ImageHolderContainer);

