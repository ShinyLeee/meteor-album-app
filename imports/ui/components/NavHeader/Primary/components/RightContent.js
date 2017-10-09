import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import NotificationIcon from 'material-ui-icons/Notifications';
import { Notes } from '/imports/api/notes/note.js';
import settings from '/imports/utils/settings';

const { sourceDomain } = settings;

class RightContent extends Component {
  static propTypes = {
    User: PropTypes.object,
    noteNum: PropTypes.number,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  get avatarSrc() {
    const { User } = this.props;
    const defaultAvatar = `${sourceDomain}/GalleryPlus/Default/default-avatar.jpg`;
    return User ? User.profile.avatar : defaultAvatar;
  }

  _navTo = (location) => () => {
    this.props.history.push(location);
  }

  render() {
    const { User, noteNum, classes } = this.props;
    if (User) {
      return (
        <div className={classes.root}>
          <IconButton
            aria-label="Search"
            color="contrast"
            onClick={this._navTo('/search')}
          ><SearchIcon />
          </IconButton>
          <IconButton
            aria-label="Note"
            color="contrast"
            onClick={this._navTo(`/note/${User.username}`)}
          >
            <Badge
              className={noteNum > 0 ? 'bell-shake' : ''}
              classes={{ badge: classes.badge }}
              style={{ height: 24 }}
              badgeContent={noteNum}
              color="primary"
            ><NotificationIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.avatar}
            aria-label="User"
            color="contrast"
            onClick={this._navTo(`/user/${User.username}`)}
          ><Avatar src={this.avatarSrc} />
          </IconButton>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <IconButton
          aria-label="Search"
          color="contrast"
          onClick={this._navTo('/search')}
        ><SearchIcon onClick={this._navTo('/search')} />
        </IconButton>
        <Button
          color="contrast"
          onClick={this._navTo('/login')}
        >登录
        </Button>
      </div>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
  },

  badge: {
    backgroundColor: 'rgb(0, 188, 212)',
  },

  avatar: {
    marginLeft: 12,
  },
};

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  withRouter,
  withTracker(({ User }) => {
    if (User) {
      Meteor.subscribe('Notes.receiver');
    }
    return {
      noteNum: User ? Notes.find({ isRead: false }).count() : 0,
    };
  }),
)(RightContent);
