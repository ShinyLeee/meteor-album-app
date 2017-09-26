import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import SearchBar from '/imports/ui/components/NavHeader/SearchBar/SearchBar.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import CollHolder from '/imports/ui/components/CollHolder/CollHolder.jsx';

export default class SearchPage extends Component {
  static defaultProps = {
    dataIsReady: false,
    users: [],
    collections: [],
  }

  static propTypes = {
    User: PropTypes.object, // not required bc guest can visit this page
    // Below Pass from Database
    dataIsReady: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  _handleSearchSubmit = (e) => {
    const { history } = this.props;
    e.preventDefault();
    history.push(`/search/${this.state.searchText}`);
  }

  renderContent() {
    const { User, collections, users, history } = this.props;
    return (
      <div className="content__search">
        <section className="search__collection">
          <header className="collection__header">
            <span>精选相册</span>
            {/* <a>展开</a> */}
          </header>
          {
            collections.map((coll, i) => {
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
            })
          }
        </section>
        <section className="search__user">
          <header className="user__header">
            <span>精选用户</span>
            {/* <a>展开</a> */}
          </header>
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
        </section>
      </div>
    );
  }

  render() {
    const { dataIsReady, history } = this.props;
    return (
      <div className="container deep">
        <SearchBar
          onLeftIconTouchTap={() => history.goBack()}
          onChange={(e) => this.setState({ searchText: e.target.value })}
          onSubmit={this._handleSearchSubmit}
        />
        <main className="content deep">
          { dataIsReady
            ? this.renderContent()
            : (<Loading />) }
        </main>
      </div>
    );
  }
}
