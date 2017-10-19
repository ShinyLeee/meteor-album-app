import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { withStyles } from 'material-ui/styles';
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
import { snackBarOpen } from '/imports/ui/redux/actions/index';
import {
  CommentsWrapper,
  CommentsSection,
  CommentsContent,
  CommentsTime,
  PublishSection,
  PublishContent,
  PublishFooter,
} from './CommentList.style';

const { sourceDomain } = settings;

const formatter = buildFormatter(CNStrings);

class CommentList extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
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

  _handleCommentClick = (e, comment) => {
    this.setState({ [comment._id]: true, popoverAnchor: e.currentTarget });
  }

  _handleCommentChange = (e) => {
    this.setState({ comment: e.target.value });
  }

  _handleReplyComment = (e, comment) => {
    this.setState({ pid: comment._id, comment: `回复@${comment.user}:` });
  }

  _handlePublishComment = () => {
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
        console.log(err);
        this.props.snackBarOpen('评论失败');
      });
  }

  _handleRemoveComment(e, comment) {
    removeComment.callPromise({ commentId: comment._id })
      .then(() => {
        this.props.snackBarOpen('删除评论成功');
      })
      .catch((err) => {
        console.log(err);
        this.props.snackBarOpen('删除评论失败');
      });
  }

  renderCommentItem() {
    const { User, comments, history } = this.props;
    return comments.map((comment) => {
      const user = Meteor.users.findOne({ username: comment.user });
      return (
        <List key={comment._id}>
          <ListItem
            onClick={(e) => this._handleCommentClick(e, comment)}
            button
          >
            <ListItemAvatar>
              <Avatar src={user && user.profile.avatar} />
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
              <ListItem onClick={(e) => this._handleReplyComment(e, comment)}>
                <ListItemText primary="回复" />
              </ListItem>
              <ListItem onClick={() => history.push(`/user/${comment.user}`)}>
                <ListItemText primary="查看该用户" />
              </ListItem>
              {
                (User && User.username) === comment.user && (
                  <ListItem onClick={(e) => this._handleRemoveComment(e, comment)}>
                    <ListItemText primary="删除评论" />
                  </ListItem>
                )
              }
            </List>
          </Popover>
        </List>
      );
    });
  }

  render() {
    const { open, comments, classes } = this.props;
    return (
      <Collapse
        in={open}
        transitionDuration="auto"
        unmountOnExit
      >
        <CommentsWrapper>
          {
            comments.length > 0 && (
              <CommentsSection>
                {this.renderCommentItem()}
              </CommentsSection>
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
        </CommentsWrapper>
      </Collapse>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

const styles = {
  input: {
    alignSelf: 'flex-end',
    paddingLeft: 16,
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withRouter,
)(CommentList);
