import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import LazyLoad from 'react-lazyload';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Card, CardHeader, CardActions, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import HeartIcon from 'material-ui/svg-icons/action/favorite';
import EmptyHeartIcon from 'material-ui/svg-icons/action/favorite-border';
import ReplyIcon from 'material-ui/svg-icons/content/reply';
import CommentIcon from 'material-ui/svg-icons/communication/chat-bubble-outline';

import CommentList from './components/CommentList.jsx';

const formatter = buildFormatter(CNStrings);

const styles = {
  flipReplyStyle: {
    MozTransform: 'scaleX(-1)',
    WebkitTransform: 'scaleX(-1)',
    OTransform: 'scaleX(-1)',
    transform: 'scaleX(-1)',
  },
};

export default class ImageHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCommentSectionOpen: false,
    };
    this.handleCommentClick = this.handleCommentClick.bind(this);
  }

  handleCommentClick(e) {
    e.preventDefault();
    this.setState({ isCommentSectionOpen: !this.state.isCommentSectionOpen });
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
      onReplyClick,
    } = this.props;

    return (
      <div className="component__ImageHolder">
        <Card>
          <CardHeader
            title={image.user}
            subtitle={<TimeAgo date={image.createdAt} formatter={formatter} />}
            avatar={avatar}
            onTouchTap={() => browserHistory.push(`/user/${image.user}`)}
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
          <CardActions>
            { isLiked
              ? (<IconButton onTouchTap={onUnlikeClick} iconStyle={{ color: '#f15151' }}><HeartIcon /></IconButton>)
              : (<IconButton onTouchTap={onLikeClick}><EmptyHeartIcon /></IconButton>) }
            <IconButton onTouchTap={this.handleCommentClick}>
              <CommentIcon />
            </IconButton>
            <IconButton style={{ float: 'right' }} onTouchTap={onReplyClick} iconStyle={styles.flipReplyStyle}>
              <ReplyIcon />
            </IconButton>
          </CardActions>
          { this.state.isCommentSectionOpen && <CommentList User={User} discId={image._id} /> }
        </Card>
      </div>
    );
  }
}

ImageHolder.displayName = 'ImageHolder';

ImageHolder.defaultProps = {
  isLiked: false,
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
  onCommentClick: PropTypes.func,
  onReplyClick: PropTypes.func,
};
