import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { SearchBar } from '/imports/ui/components/NavHeader';
import CollHolder from '/imports/ui/components/CollHolder';

export default class SearchPage extends Component {
  static propTypes = {
    User: PropTypes.object, // not required bc guest can visit this page
    dataIsReady: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    searchText: null,
  }

  _handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  _handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!this.state.searchText) {
      return;
    }
    const { history } = this.props;
    history.push(`/search/${this.state.searchText}`);
  }

  renderContent() {
    const { User, collections, users } = this.props;
    return (
      <div className="content__search">
        <section className="search__collection">
          <header className="collection__header">
            <span>精选相册</span>
            {/* <a>展开</a> */}
          </header>
          {
            collections.map((coll) => {
              let avatarSrc;
              if (User && (coll.user === User.username)) {
                avatarSrc = User.profile.avatar;
              } else {
                avatarSrc = Meteor.users.findOne({ username: coll.user }).profile.avatar;
              }
              return (
                <CollHolder
                  key={coll._id}
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
            onClick={() => history.goBack()}
            onChange={this._handleSearchChange}
            onSubmit={this._handleSearchSubmit}
          />
        }
      >
        { dataIsReady && this.renderContent() }
      </ViewLayout>
    );
  }
}
