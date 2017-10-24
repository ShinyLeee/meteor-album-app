import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Paper from 'material-ui/Paper';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import CollHolder from '/imports/ui/components/CollHolder';
import NoteHolder from '/imports/ui/components/NoteHolder';

export default class SearchResultsContent extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    User: PropTypes.object, // not required bc guest can visit
    users: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    notes: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  renderCollResults(query) {
    const { User, collections } = this.props;
    if (collections.length === 0) {
      return <p className="search__empty">未找到符合“{query}”的结果</p>;
    }
    return collections.map((coll) => {
      const avatarSrc = User && (coll.user === User.username)
        ? User.profile.avatar
        : Meteor.users.findOne({ username: coll.user }).profile.avatar;
      return (
        <CollHolder
          key={coll._id}
          coll={coll}
          avatarSrc={avatarSrc}
        />
      );
    });
  }

  renderUserResults(query) {
    const { users } = this.props;
    if (users.length === 0) {
      return <p className="search__empty">未找到符合“{query}”的结果</p>;
    }
    return (
      <Paper className="user__container">
        {
          users.map((user) => (
            <div
              key={user._id}
              className="user__content"
              role="button"
              tabIndex={-1}
              onClick={() => this.props.history.push(`/user/${user.username}`)}
            >
              <div className="user__avatar">
                <img src={user.profile.avatar} alt={user.username} />
              </div>
              <div className="user__info">
                <div className="user__name">{user.username}</div>
              </div>
            </div>
          ))
        }
      </Paper>
    );
  }

  renderNoteResults(query) {
    const { notes } = this.props;
    if (notes.length === 0) {
      return <p className="search__empty">未找到符合“{query}”的结果</p>;
    }
    return (
      <div className="note__container">
        {
          notes.map((note) => {
            const receiverObj = Meteor.users.findOne({ username: note.receiver });
            return (
              <NoteHolder
                key={note._id}
                avatar={receiverObj && receiverObj.profile.avatar}
                note={note}
                isRead
              />
            );
          })
        }
      </div>
    );
  }

  render() {
    const { dataIsReady, match } = this.props;
    const query = _.get(match, 'params.query');
    return (
      <ContentLayout
        loading={!dataIsReady}
        delay
        deep
      >
        <div className="content__search">
          <section className="search__query">
            以下为&quot;{query}&quot;的搜索结果:
          </section>
          <section className="search__collection">
            <header className="collection__header">
              <span>相册</span>
            </header>
            { this.renderCollResults(query) }
          </section>
          <section className="search__user">
            <header className="user__header">
              <span>用户</span>
            </header>
            { this.renderUserResults(query) }
          </section>
          <section className="search__note">
            <header className="note__header">
              <span>信息</span>
            </header>
            { this.renderNoteResults(query) }
          </section>
        </div>
      </ContentLayout>
    );
  }
}

