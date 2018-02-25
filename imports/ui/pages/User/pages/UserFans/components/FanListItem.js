import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Avatar from 'material-ui/Avatar';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import Button from 'material-ui/Button';

export default class UserFansContent extends PureComponent {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    User: PropTypes.object,
    fan: PropTypes.object.isRequired,
    onToggleFollow: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  render() {
    const {
      isLoggedIn,
      User,
      fan,
      classes,
    } = this.props;
    const followers = get(fan, 'profile.followers');
    const isFollowed = isLoggedIn && followers && followers.indexOf(User.username) !== -1;
    return (
      <ListItem
        disableRipple
        button
        divider
      >
        <Avatar
          src={get(fan, 'profile.avatar')}
          onClick={() => this.props.history.push(`/user/${get(fan, 'username')}`)}
        />
        <ListItemText
          primary={get(fan, 'username')}
          secondary={get(fan, 'profile.nickname')}
        />
        <Button
          className={isFollowed ? classes.btn__blue : classes.btn__white}
          onClick={() => this.props.onToggleFollow(isFollowed, fan)}
          disableRipple
          raised
        >
          { isFollowed ? '互相关注' : '关注' }
        </Button>
      </ListItem>
    );
  }
}
