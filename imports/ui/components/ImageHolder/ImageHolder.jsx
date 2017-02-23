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
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import EmptyHeartIcon from 'material-ui/svg-icons/action/favorite-border';
import CommentIcon from 'material-ui/svg-icons/communication/chat-bubble-outline';
import { Comments } from '/imports/api/comments/comment.js';
import { snackBarOpen } from '/imports/ui/redux/actions/index.js';
import CommentList from './components/CommentList.jsx';
import {
  Wrapper,
  ActionButtonWrapper,
  ActionButtonNum,
  StyledIconButton,
  Image,
} from './ImageHolder.style.js';

const formatter = buildFormatter(CNStrings);

class ImageHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCommentOpen: false,
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

    const { isCommentOpen } = this.state;
    return (
      <Wrapper>
        <Card>
          <CardHeader
            title={image.user}
            subtitle={<TimeAgo date={image.createdAt} formatter={formatter} />}
            avatar={(
              <Avatar
                src={avatar}
                onTouchTap={() => browserHistory.push(`/user/${image.user}`)}
              />
            )}
          />
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionAppear
            transitionAppearTimeout={375}
            transitionEnterTimeout={375}
            transitionLeave={false}
          >
            <CardMedia onTouchTap={onMediaClick}>
              <LazyLoad height={200} offset={200} once>
                <Image src={imageSrc} role="presentation" />
              </LazyLoad>
            </CardMedia>
          </ReactCSSTransitionGroup>
          <CardActions>
            <ActionButtonWrapper>
              {
                isLiked
                ? (
                  <StyledIconButton
                    iconStyle={{ color: '#f15151' }}
                    onTouchTap={onUnlikeClick}
                  ><HeartIcon />
                  </StyledIconButton>
                )
                : (
                  <StyledIconButton
                    onTouchTap={onLikeClick}
                  ><EmptyHeartIcon />
                  </StyledIconButton>
                )
              }
              { image.liker.length > 0 && <ActionButtonNum>{image.liker.length}</ActionButtonNum> }
            </ActionButtonWrapper>
            <ActionButtonWrapper>
              <StyledIconButton
                onTouchTap={() => this.setState({ isCommentOpen: !isCommentOpen })}
              ><CommentIcon />
              </StyledIconButton>
              { comments.length > 0 && <ActionButtonNum>{comments.length}</ActionButtonNum> }
            </ActionButtonWrapper>
          </CardActions>
          <ReactCSSTransitionGroup
            transitionName="slideDown"
            transitionEnterTimeout={375}
            transitionLeaveTimeout={375}
          >
            {
              isCommentOpen && (
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
      </Wrapper>
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
