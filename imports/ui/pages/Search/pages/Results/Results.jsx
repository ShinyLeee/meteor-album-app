import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import SearchBar from '/imports/ui/components/NavHeader/SearchBar/SearchBar.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import CollHolder from '/imports/ui/components/CollHolder/CollHolder.jsx';
import NoteHolder from '/imports/ui/components/NoteHolder/NoteHolder.jsx';

export default class SearchResultsPage extends Component {
  static propTypes = {
    // Below Pass from Redux
    User: PropTypes.object, // not required bc guest can visit
    // Below Pass from React-Router
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    // Below Pass from Database
    dataIsReady: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    notes: PropTypes.array.isRequired,
  }

  static defaultProps = {
    dataIsReady: false,
    users: [],
    collections: [],
    notes: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
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
    return collections.map((coll, i) => {
      let avatarSrc;
      if (User && (coll.user === User.username)) avatarSrc = User.profile.avatar;
      else avatarSrc = Meteor.users.findOne({ username: coll.user }).profile.avatar;
      return (
        <CollHolder
          key={i}
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
          users.map((user, i) => (
            <div
              key={i}
              className="user__content"
              onTouchTap={() => history.push(`/user/${user.username}`)}
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
    if (notes.length === 0) return <p className="search__empty">未找到符合“{query}”的结果</p>;
    return (
      <div className="note__container">
        {
          notes.map((note, i) => {
            const receiverObj = Meteor.users.findOne({ username: note.receiver });
            return (
              <NoteHolder
                key={i}
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
    const { dataIsReady, match, history } = this.props;
    const { query } = match.params;
    return (
      <div className="container deep">
        <SearchBar
          onLeftIconTouchTap={() => history.replace('/search')}
          onChange={(e) => this.setState({ searchText: e.target.value })}
          onSubmit={this._handleSearchSubmit}
        />
        <main className="content deep">
          { dataIsReady
            ? (
              <div className="content__search">
                <section className="search__query">
                  以下为"{query}"的搜索结果:
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
            )
            : (<Loading />) }
        </main>
      </div>
    );
  }
}
