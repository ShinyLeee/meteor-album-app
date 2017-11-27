import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import CollList from '/imports/ui/components/CollList';
import UserList from '../../../components/UserList';
import {
  CollSection,
  UserSection,
  Header,
} from '../styles';

export default class SearchContent extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
  }

  render() {
    const { users, collections } = this.props;
    return [
      <CollSection key="CollSection">
        <Header>精选相册</Header>
        <CollList colls={collections} />
      </CollSection>,
      <UserSection key="UserSection">
        <Header>精选用户</Header>
        <UserList
          users={users}
          onItemClick={(user) => this.props.history.push(`/user/${user.username}`)}
        />
      </UserSection>,
    ];
  }
}
