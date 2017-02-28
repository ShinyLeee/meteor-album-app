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
      clientWidth,
      domain,
      User,
      image,
      onLikeClick,
      onUnlikeClick,
      onMediaClick,
      comments,
    } = this.props;

    // get avatar src
    const imageOwner = Meteor.users.findOne({ username: image.user });
    const avatar = imageOwner && imageOwner.profile.avatar;

    // get image src
    const url = `${domain}/${image.user}/${image.collection}/${image.name}.${image.type}`;
    const retinaWidth = Math.round(clientWidth * window.devicePixelRatio);

    // realHeight for lazyload
    const realHeight = Math.round((image.dimension[1] / image.dimension[0]) * clientWidth);
    const imageSrc = `${url}?imageView2/2/w/${retinaWidth}`;

    // whether current user liked this image
    const curUser = User && User.username;
    const isLiked = image.liker.indexOf(curUser) > -1;

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
          <CardMedia onTouchTap={onMediaClick}>
            <LazyLoad
              placeholder={<div style={{ height: `${realHeight}px`, backgroundColor: image.color }} />}
              height={realHeight}
              once
            >
              <Image src={imageSrc} role="presentation" />
            </LazyLoad>
          </CardMedia>
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
                  <StyledIconButton onTouchTap={onLikeClick}>
                    <EmptyHeartIcon />
                  </StyledIconButton>
                )
              }
              { image.liker.length > 0 && <ActionButtonNum>{image.liker.length}</ActionButtonNum> }
            </ActionButtonWrapper>
            <ActionButtonWrapper>
              <StyledIconButton onTouchTap={() => this.setState(prevState => ({ isCommentOpen: !prevState.isCommentOpen }))}>
                <CommentIcon />
              </StyledIconButton>
              { comments.length > 0 && <ActionButtonNum>{comments.length}</ActionButtonNum> }
            </ActionButtonWrapper>
          </CardActions>
          <CommentList
            key={image._id}
            open={this.state.isCommentOpen}
            User={User}
            discId={image._id}
            comments={comments}
            snackBarOpen={this.props.snackBarOpen}
          />
        </Card>
      </Wrapper>
    );
  }
}

ImageHolder.displayName = 'ImageHolder';

ImageHolder.defaultProps = {
  domain: Meteor.settings.public.imageDomain,
  clientWidth: document.body.clientWidth,
  comments: [],
};

ImageHolder.propTypes = {
  domain: PropTypes.string.isRequired,
  clientWidth: PropTypes.number.isRequired,
  User: PropTypes.object, // not required bc guest can visit it
  image: PropTypes.object.isRequired,
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(MeteorContainer);
