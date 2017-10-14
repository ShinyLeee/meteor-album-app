import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { SearchBar } from '/imports/ui/components/NavHeader';
import CollHolder from '/imports/ui/components/CollHolder';
import NoteHolder from '/imports/ui/components/NoteHolder';

export default class SearchResultsPage extends Component {
  static propTypes = {
    User: PropTypes.object, // not required bc guest can visit
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    dataIsReady: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    notes: PropTypes.array.isRequired,
  }

  state = {
    searchText: '',
  }

  _handleSearchSubmit = (e) => {
    e.preventDefault();
    this.props.history.replace(`/search/${this.state.searchText}`);
  }

  renderCollResults() {
    const { User, collections, match } = this.props;
    const { query } = match.params;
    if (collections.length === 0) {
      return <p className="search__empty">未找到符合“{query}”的结果</p>;
    }
    return collections.map((coll) => {
      let avatarSrc;
      if (User && (coll.user === User.username)) avatarSrc = User.profile.avatar;
      else avatarSrc = Meteor.users.findOne({ username: coll.user }).profile.avatar;
      return (
        <CollHolder
          key={coll._id}
          coll={coll}
          avatarSrc={avatarSrc}
        />
      );
    });
  }

  renderUserResults() {
    const { users, match, history } = this.props;
    const { query } = match.params;
    if (users.length === 0) return <p className="search__empty">未找到符合“{query}”的结果</p>;
    return (
      <Paper className="user__container">
        {
          users.map((user) => (
            <div
              key={user._id}
              className="user__content"
              role="button"
              tabIndex={-1}
              onClick={() => history.push(`/user/${user.username}`)}
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

  renderNoteResults() {
    const { notes, match } = this.props;
    const { query } = match.params;
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

  renderContent() {
    const { query } = this.props.match.params;
    return (
      <div className="content__search">
        <section className="search__query">
          以下为&quot;{query}&quot;的搜索结果:
        </section>
        <section className="search__collection">
          <header className="collection__header">
            <span>相册</span>
          </header>
          { this.renderCollResults() }
        </section>
        <section className="search__user">
          <header className="user__header">
            <span>用户</span>
          </header>
          { this.renderUserResults() }
        </section>
        <section className="search__note">
          <header className="note__header">
            <span>信息</span>
          </header>
          { this.renderNoteResults() }
        </section>
      </div>
    );
  }

  render() {
    const { dataIsReady, history } = this.props;
    return (
      <ViewLayout
        deep
        loading={!dataIsReady}
        Topbar={
          <SearchBar
            onClick={() => history.replace('/search')}
            onChange={(e) => this.setState({ searchText: e.target.value })}
            onSubmit={this._handleSearchSubmit}
          />
        }
      >
        { dataIsReady && this.renderContent() }
      </ViewLayout>
    );
  }
}
