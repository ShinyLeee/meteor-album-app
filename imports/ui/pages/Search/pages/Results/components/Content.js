import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import CollList from '/imports/ui/components/CollList';
import NoteHolder from '/imports/ui/components/NoteHolder';
import UserList from '../../../components/UserList';
import {
  Tip,
  Section,
  Header,
  EmptyMessage,
} from '../styles';

export default class SearchResultsContent extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    notes: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  renderCollResults(query) {
    const { collections } = this.props;
    if (collections.length === 0) {
      return <EmptyMessage>未找到符合“{query}”的结果</EmptyMessage>;
    }
    return <CollList colls={collections} />;
  }

  renderUserResults(query) {
    const { users } = this.props;
    if (users.length === 0) {
      return <EmptyMessage>未找到符合“{query}”的结果</EmptyMessage>;
    }
    return (
      <UserList
        users={users}
        onItemClick={(user) => this.props.history.push(`/user/${user.username}`)}
      />
    );
  }

  renderNoteResults(query) {
    const { notes } = this.props;
    if (notes.length === 0) {
      return <EmptyMessage>未找到符合“{query}”的结果</EmptyMessage>;
    }
    return (
      <div>
        {
          notes.map((note) => (
            <NoteHolder
              key={note._id}
              note={note}
              isRead
            />
          ))
        }
      </div>
    );
  }

  render() {
    const { dataIsReady, match } = this.props;
    const query = get(match, 'params.query');
    return (
      <ContentLayout
        loading={!dataIsReady}
        delay
        deep
      >
        <Tip>以下为&quot;{query}&quot;的搜索结果:</Tip>
        <Section>
          <Header>相册</Header>
          { this.renderCollResults(query) }
        </Section>
        <Section>
          <Header>用户</Header>
          { this.renderUserResults(query) }
        </Section>
        <Section>
          <Header>信息</Header>
          { this.renderNoteResults(query) }
        </Section>
      </ContentLayout>
    );
  }
}

