import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  List,
  ListItem,
  Avatar,
  Info,
} from './UserList.style';

export default class UserList extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    onItemClick: PropTypes.func.isRequired,
  }

  render() {
    const { users } = this.props;
    return (
      <List>
        {
          users.map((user) => (
            <ListItem
              key={user._id}
              onClick={() => this.props.onItemClick(user)}
            >
              <Avatar>
                <img src={user.profile.avatar} alt={user.username} />
              </Avatar>
              <Info>{user.username}</Info>
            </ListItem>
          ))
        }
      </List>
    );
  }
}

