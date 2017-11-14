import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import CollList from '/imports/ui/components/CollList';
import UserList from '../../../components/UserList';
import {
  CollSection,
  UserSection,
  Header,
} from '../styles';

export default class SearchContent extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
  }

  render() {
    const { dataIsReady, users, collections } = this.props;
    return (
      <ContentLayout
        loading={!dataIsReady}
        deep
      >
        <CollSection>
          <Header>精选相册</Header>
          { dataIsReady && <CollList colls={collections} />}
        </CollSection>
        <UserSection>
          <Header>精选用户</Header>
          {
            dataIsReady && (
              <UserList
                users={users}
                onItemClick={(user) => this.props.history.push(`/user/${user.username}`)}
              />
            )
          }
        </UserSection>
      </ContentLayout>
    );
  }
}
