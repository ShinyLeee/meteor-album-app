import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
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
import { Notes } from '/imports/api/notes/note';
import settings from '/imports/utils/settings';
import { RightContent } from '../../NavHeader.style';

const { sourceDomain } = settings;

class RightContentComp extends PureComponent {
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
    return (
      <RightContent>
        <IconButton
          className={classes.iconBtn}
          aria-label="Search"
          color="contrast"
          onClick={this._navTo('/search')}
        ><SearchIcon />
        </IconButton>
        {
          User && (
            <IconButton
              className={classes.iconBtn}
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
          )
        }
        {
          User
          ? (
            <IconButton
              className={classes.avatar}
              aria-label="User"
              color="contrast"
              onClick={this._navTo(`/user/${User.username}`)}
            ><Avatar classes={{ root: classes.avatar }} src={this.avatarSrc} />
            </IconButton>
          )
          : (
            <Button
              color="contrast"
              onClick={this._navTo('/login')}
            >登录
            </Button>
          )
        }
      </RightContent>
    );
  }
}

const styles = theme => ({
  iconBtn: {
    [theme.breakpoints.down('xs')]: {
      width: 42,
      height: 42,
    },
  },

  badge: {
    backgroundColor: 'rgb(0, 188, 212)',
  },

  avatar: {
    marginLeft: 12,
    [theme.breakpoints.down('xs')]: {
      width: 42,
      height: 42,
      marginLeft: 10,
    },
  },
});

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
)(RightContentComp);
