import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';

import { insertComment, removeComment } from '/imports/api/comments/methods.js';

const formatter = buildFormatter(CNStrings);

export default class CommentList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pid: '',
      comment: '',
    };
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handlePublishComment = this.handlePublishComment.bind(this);
  }

  get avatarSrc() {
    const defaultAvatar = `${this.props.sourceDomain}/GalleryPlus/Default/default-avatar.jpg`;
    return this.props.User ? this.props.User.profile.avatar : defaultAvatar;
  }

  handleCommentClick(e, comment) {
    e.preventDefault();
    this.setState({ [comment._id]: true, anchorEl: e.currentTarget });
  }

  handleCommentChange(e) {
    this.setState({ comment: e.target.value });
  }

  handleReplyComment(e, comment) {
    e.preventDefault();
    this.setState({ pid: comment._id, comment: `回复@${comment.user}:` });
  }

  handlePublishComment(e) {
    e.preventDefault();

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

    insertComment.callPromise(newComment)
    .then(() => {
      this.setState({ pid: '', comment: '' });
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen('评论失败');
      throw new Meteor.Error(err);
    });
  }

  handleRemoveComment(e, comment) {
    e.preventDefault();
    removeComment.callPromise({ commentId: comment._id })
    .then(() => {
      this.props.snackBarOpen('删除评论成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen('删除评论失败');
      throw new Meteor.Error(err);
    });
  }

  renderCommentList() {
    const { User, comments } = this.props;
    return comments.map((comment, i) => {
      const user = Meteor.users.findOne({ username: comment.user });
      return (
        <div key={i}>
          <ListItem
            leftAvatar={<Avatar src={user && user.profile.avatar} />}
            primaryText={
              <div className="CommentList__header">
                <span>{comment.user}</span>
                <TimeAgo date={comment.createdAt} formatter={formatter} />
              </div>
            }
            secondaryText={<div dangerouslySetInnerHTML={{ __html: comment.content }} />}
            secondaryTextLines={2}
            onTouchTap={(e) => this.handleCommentClick(e, comment)}
          />
          <Popover
            open={this.state[comment._id]}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            targetOrigin={{ horizontal: 'right', vertical: 'center' }}
            onRequestClose={() => this.setState({ [comment._id]: false })}
          >
            <Menu>
              <MenuItem primaryText="回复" onTouchTap={(e) => this.handleReplyComment(e, comment)} />
              <MenuItem primaryText="查看该用户" onTouchTap={() => browserHistory.push(`/user/${comment.user}`)} />
              {
                (User && User.username) === comment.user &&
                (<MenuItem primaryText="删除评论" onTouchTap={(e) => this.handleRemoveComment(e, comment)} />)
              }
            </Menu>
          </Popover>
        </div>
      );
    });
  }

  render() {
    const { comments } = this.props;
    return (
      <div className="component__CommentList">
        <List className="CommentList__comments">
          { comments.length > 0 && this.renderCommentList() }
        </List>
        <div className="CommentList__publish">
          <div className="CommentList__textfield">
            <Avatar src={this.avatarSrc} />
            <TextField
              className="CommentList__input"
              name="comment"
              value={this.state.comment}
              hintText="发表评论..."
              underlineShow={false}
              onChange={this.handleCommentChange}
              multiLine
            />
          </div>
          <div className="CommentList__toolbox">
            <FlatButton
              label="发布"
              onTouchTap={this.handlePublishComment}
            />
          </div>
        </div>
      </div>
    );
  }
}

CommentList.displayName = 'CommentList';

CommentList.defaultProps = {
  sourceDomain: Meteor.settings.public.sourceDomain,
};

CommentList.propTypes = {
  User: PropTypes.object, // not required bc guest can visit it
  sourceDomain: PropTypes.string.isRequired,
  discId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};
