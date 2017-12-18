import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Avatar from 'material-ui/Avatar';
import { ListItem, ListItemAvatar } from 'material-ui/List';
import {
  CommentsContent,
  CommentsTime,
} from './CommentList.style';

const formatter = buildFormatter(CNStrings);

class CommentListItem extends PureComponent {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    commenter: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  render() {
    const {
      comment,
      commenter,
      onClick,
    } = this.props;
    return (
      <ListItem
        onClick={(e) => onClick(e, comment)}
        button
      >
        <ListItemAvatar>
          <Avatar src={get(commenter, 'profile.avatar')} />
        </ListItemAvatar>
        <CommentsContent>
          <h3>{comment.user}</h3>
          <div dangerouslySetInnerHTML={{ __html: comment.content }} />
        </CommentsContent>
        <CommentsTime>
          <TimeAgo date={comment.createdAt} formatter={formatter} />
        </CommentsTime>
      </ListItem>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  isLoggedIn: sessions.isLoggedIn,
  User: sessions.User,
});

const trackHandler = ({ isLoggedIn, User, comment }) => {
  let commenter;
  if (isLoggedIn && User.username === comment.user) {
    commenter = User;
  } else {
    Meteor.subscribe('Users.all');
    commenter = Meteor.users.findOne({ username: comment.user }) || {};
  }
  return {
    commenter,
  };
};

export default compose(
  connect(mapStateToProps),
  withTracker(trackHandler),
)(CommentListItem);
