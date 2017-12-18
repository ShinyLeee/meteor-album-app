import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import LazyLoad from 'react-lazyload';
import Avatar from 'material-ui/Avatar';
import Card, { CardHeader, CardActions } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import HeartIcon from 'material-ui-icons/Favorite';
import EmptyHeartIcon from 'material-ui-icons/FavoriteBorder';
import CommentIcon from 'material-ui-icons/ChatBubbleOutline';
import settings from '/imports/utils/settings';
import CommentList from '/imports/ui/components/CommentList';
import ProgressiveImage from '/imports/ui/components/ProgressiveImage';
import { Wrapper, ActionButtonNum } from './ImageHolder.style';

const formatter = buildFormatter(CNStrings);

const { imageDomain } = settings;

export default class ImageHolder extends PureComponent {
  static propTypes = {
    User: PropTypes.object, // not required bc guest can visit it
    owner: PropTypes.object.isRequired, // real time data
    image: PropTypes.object.isRequired, // real time data
    commentsNum: PropTypes.number.isRequired, // real time data
    device: PropTypes.object.isRequired,
    onToggleLike: PropTypes.func.isRequired,
    onMediaClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    isCommentOpen: false,
  }

  _handleMediaClick = () => {
    this.props.onMediaClick(this.props.image);
  }

  _handleToggleComment = () => {
    this.setState(
      prevState => ({ isCommentOpen: !prevState.isCommentOpen }),
    );
  }

  render() {
    const {
      User,
      owner,
      image,
      commentsNum,
      device,
      classes,
    } = this.props;

    const { width, pixelRatio } = device;

    // get image src
    const url = `${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`;

    // realHeight for lazyload
    const realHeight = Math.round((image.dimension[1] / image.dimension[0]) * width);

    const imageSrc = `${url}?imageView2/2/w/${width * pixelRatio}`;

    const isLiked = User && image.liker.indexOf(User.username) > -1;

    return (
      <Wrapper>
        <Card>
          <CardHeader
            title={image.user}
            subheader={<TimeAgo date={image.createdAt} formatter={formatter} />}
            avatar={
              <Avatar
                src={get(owner, 'profile.avatar')}
                onClick={() => this.props.history.push(`/user/${image.user}`)}
              />
            }
          />
          <LazyLoad
            height={realHeight}
            once
          >
            <ProgressiveImage
              src={imageSrc}
              aspectRatio={image.dimension[1] / image.dimension[0]}
              color={image.color}
            ><img src={imageSrc} alt={image.name} onClick={this._handleMediaClick} />
            </ProgressiveImage>
          </LazyLoad>
          <CardActions>
            {
              isLiked
              ? (
                <IconButton
                  classes={{ root: classes.btn__heart, icon: classes.icon }}
                  onClick={() => this.props.onToggleLike(!isLiked, image)}
                >
                  <HeartIcon />
                  <ActionButtonNum visible={image.liker.length > 0}>
                    {image.liker.length}
                  </ActionButtonNum>
                </IconButton>
              )
              : (
                <IconButton
                  classes={{ root: classes.btn, icon: classes.icon }}
                  onClick={() => this.props.onToggleLike(!isLiked, image)}
                >
                  <EmptyHeartIcon />
                  <ActionButtonNum visible={image.liker.length > 0}>
                    {image.liker.length}
                  </ActionButtonNum>
                </IconButton>
              )
            }
            <IconButton
              classes={{ root: classes.btn, icon: classes.icon }}
              onClick={this._handleToggleComment}
            >
              <CommentIcon />
              <ActionButtonNum visible={commentsNum > 0}>
                {commentsNum}
              </ActionButtonNum>
            </IconButton>
          </CardActions>
          <CommentList
            open={this.state.isCommentOpen}
            discId={image._id}
          />
        </Card>
      </Wrapper>
    );
  }
}
