import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Collapse from 'material-ui/transitions/Collapse';
import Popover from 'material-ui/Popover';
import Input from 'material-ui/Input';
import List, {
  ListItem,
  ListItemAvatar,
  ListItemText,
} from 'material-ui/List';
import { insertComment, removeComment } from '/imports/api/comments/methods';
import settings from '/imports/utils/settings';
import {
  CommentsContent,
  CommentsTime,
  PublishSection,
  PublishContent,
  PublishFooter,
} from './CommentList.style';

const { sourceDomain } = settings;

const formatter = buildFormatter(CNStrings);

export default class CommentList extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    owner: PropTypes.object.isRequired,
    discId: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    User: PropTypes.object, // not required bc guest can visit it
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  state = {
    pid: '',
    comment: '',
  }

  get avatarSrc() {
    const { User } = this.props;
    const defaultAvatar = `${sourceDomain}/GalleryPlus/Default/default-avatar.jpg`;
    return User ? User.profile.avatar : defaultAvatar;
  }

  _handleCommentClick(e, comment) {
    this.setState({ [comment._id]: true, popoverAnchor: e.currentTarget });
  }

  _handleCommentChange = (e) => {
    this.setState({ comment: e.target.value });
  }

  _handleReplyComment(comment) {
    this.setState({ pid: comment._id, comment: `回复@${comment.user}:` });
  }

  _handlePublishComment = async () => {
    const { User, discId } = this.props;
    const pid = this.state.pid;
    let content = this.state.comment;

    if (!User) {
      this.props.snackBarOpen('您还尚未登陆');
      return;
    }

    // 如果匹配到comment内容是以回复@开头，:结尾的则转换为anchor标签，链接为被回复用户的主页
    const replyRegex = /^回复@(.+):(.*)/;
    const ret = content.match(replyRegex);
    if (ret) {
      // ret[1] --> username ret[2] --> comment content
      if (!ret[2]) {
        this.props.snackBarOpen('评论内容不能为空');
        return;
      }
      content = `回复<a href="/user/${ret[1]}">@${ret[1]}</a>:${ret[2]}`;
    }

    const newComment = {
      user: User.username,
      discussion_id: discId,
      parent_id: pid,
      content,
      createdAt: new Date(),
    };

    try {
      await insertComment.callPromise(newComment);
      this.setState({ pid: '', comment: '' });
    } catch (err) {
      console.warn(err);
      this.props.snackBarOpen('评论失败');
    }
  }

  async _handleRemoveComment(comment) {
    try {
      await removeComment.callPromise({ commentId: comment._id });
      this.props.snackBarOpen('删除评论成功');
    } catch (err) {
      console.warn(err);
      this.props.snackBarOpen('删除评论失败');
    }
  }

  render() {
    const {
      open,
      owner,
      comments,
      User,
      classes,
    } = this.props;
    return (
      <Collapse
        in={open}
        transitionDuration="auto"
        unmountOnExit
      >
        {
          comments.length > 0 && comments.map((comment) => (
            <List key={comment._id} className={classes.list}>
              <ListItem
                onClick={(e) => this._handleCommentClick(e, comment)}
                button
              >
                <ListItemAvatar>
                  <Avatar src={get(owner, 'profile.avatar')} />
                </ListItemAvatar>
                <CommentsContent>
                  <h3>{comment.user}</h3>
                  <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                </CommentsContent>
                <CommentsTime>
                  <TimeAgo date={comment.createdAt} formatter={formatter} />
                </CommentsTime>
              </ListItem>
              <Popover
                open={this.state[comment._id]}
                anchorEl={this.state.popoverAnchor}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                transformOrigin={{ horizontal: 'right', vertical: 'center' }}
                onRequestClose={() => this.setState({ [comment._id]: false })}
              >
                <List>
                  <ListItem onClick={() => this._handleReplyComment(comment)}>
                    <ListItemText primary="回复" />
                  </ListItem>
                  <ListItem onClick={() => this.props.history.push(`/user/${comment.user}`)}>
                    <ListItemText primary="查看该用户" />
                  </ListItem>
                  {
                    (get(User, 'username')) === comment.user && (
                      <ListItem onClick={() => this._handleRemoveComment(comment)}>
                        <ListItemText primary="删除评论" />
                      </ListItem>
                    )
                  }
                </List>
              </Popover>
            </List>
            ),
          )
        }
        <PublishSection>
          <PublishContent>
            <Avatar src={this.avatarSrc} />
            <Input
              className={classes.input}
              name="comment"
              value={this.state.comment}
              placeholder="发表评论..."
              onChange={this._handleCommentChange}
              disableUnderline
              fullWidth
              multiline
            />
          </PublishContent>
          <PublishFooter>
            <Button onClick={this._handlePublishComment}>发布</Button>
          </PublishFooter>
        </PublishSection>
      </Collapse>
    );
  }
}
