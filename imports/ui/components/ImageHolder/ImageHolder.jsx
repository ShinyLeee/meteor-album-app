import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import LazyLoad from 'react-lazyload';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Avatar from 'material-ui/Avatar';
import { Card, CardHeader, CardActions, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import EmptyHeartIcon from 'material-ui/svg-icons/action/favorite-border';
import CommentIcon from 'material-ui/svg-icons/communication/chat-bubble-outline';

import { Comments } from '/imports/api/comments/comment.js';
import { snackBarOpen } from '/imports/ui/redux/actions/index.js';
import CommentList from './components/CommentList.jsx';

const formatter = buildFormatter(CNStrings);

class ImageHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCommentSectionOpen: false,
    };
  }

  render() {
    const {
      User,
      avatar,
      image,
      imageSrc,
      isLiked,
      onLikeClick,
      onUnlikeClick,
      onMediaClick,
      comments,
    } = this.props;

    return (
      <div className="component__ImageHolder">
        <Card>
          <CardHeader
            title={image.user}
            subtitle={<TimeAgo date={image.createdAt} formatter={formatter} />}
            avatar={<Avatar src={avatar} onTouchTap={() => browserHistory.push(`/user/${image.user}`)} />}
          />
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionAppear
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeave={false}
          >
            <CardMedia onTouchTap={onMediaClick}>
              <LazyLoad height={200} offset={200} once>
                <img style={{ width: '100%' }} src={imageSrc} role="presentation" />
              </LazyLoad>
            </CardMedia>
          </ReactCSSTransitionGroup>
          <CardActions className="ImageHolder__actions">
            <div className="ImageHolder__like">
              {
                isLiked
                ? (<IconButton onTouchTap={onUnlikeClick} iconStyle={{ color: '#f15151' }}><HeartIcon /></IconButton>)
                : (<IconButton onTouchTap={onLikeClick}><EmptyHeartIcon /></IconButton>)
              }
              { image.liker.length > 0 && <span>{image.liker.length}</span> }
            </div>
            <div className="ImageHolder__comment">
              <IconButton onTouchTap={() => this.setState({ isCommentSectionOpen: !this.state.isCommentSectionOpen })}>
                <CommentIcon />
              </IconButton>
              { comments.length > 0 && <span>{comments.length}</span> }
            </div>
          </CardActions>
          <ReactCSSTransitionGroup
            transitionName="slideDown"
            transitionEnterTimeout={375}
            transitionLeaveTimeout={375}
          >
            {
              this.state.isCommentSectionOpen && (
                <CommentList
                  key={image._id}
                  User={User}
                  discId={image._id}
                  comments={comments}
                  snackBarOpen={this.props.snackBarOpen}
                />
              )
            }
          </ReactCSSTransitionGroup>
        </Card>
      </div>
    );
  }
}

ImageHolder.displayName = 'ImageHolder';

ImageHolder.defaultProps = {
  isLiked: false,
  comments: [],
};

ImageHolder.propTypes = {
  User: PropTypes.object, // not required bc guest can visit it
  avatar: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  imageSrc: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  onLikeClick: PropTypes.func,
  onUnlikeClick: PropTypes.func,
  onMediaClick: PropTypes.func,
  // Below Pass from Database and Redux
  comments: PropTypes.array.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};

const MeteorContainer = createContainer(({ image }) => {
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

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
