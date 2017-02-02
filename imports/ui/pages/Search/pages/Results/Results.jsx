import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Paper from 'material-ui/Paper';

import SearchBar from '/imports/ui/components/NavHeader/components/SearchBar/SearchBar.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';

export default class ResultsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleSearchSubmit(e) {
    e.preventDefault();
    browserHistory.push(`/search/${this.state.searchText}`);
  }

  renderCollResults() {
    const { collections, params: { query } } = this.props;
    if (collections.length === 0) return <p className="search__empty">未找到符合“{query}”的结果</p>;
    return collections.map((coll, i) => {
      const user = Meteor.users.findOne({ username: coll.user });
      return (
        <Paper
          key={i}
          className="collection__content"
          onTouchTap={() => browserHistory.push(`/user/${coll.user}/collection/${coll.name}`)}
        >
          <div className="collection__cover">
            <img src={coll.cover} alt={coll.name} />
          </div>
          <div className="collection__info">
            <div className="collection__avatar">
              <img src={user && user.profile.avatar} alt={coll.user} />
            </div>
            <div className="collection__name">{coll.name}</div>
            <div className="collection__username">{coll.user}</div>
          </div>
        </Paper>
      );
    });
  }

  renderUserResults() {
    const { users, params: { query } } = this.props;
    if (users.length === 0) return <p className="search__empty">未找到符合“{query}”的结果</p>;
    return (
      <Paper className="user__container">
        {
          users.map((user, i) => (
            <div
              key={i}
              className="user__content"
              onTouchTap={() => browserHistory.push(`/user/${user.username}`)}
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

  render() {
    const { params: { query } } = this.props;
    return (
      <div className="container deep">
        <SearchBar
          onLeftIconTouchTap={() => browserHistory.goBack()}
          onChange={(e) => this.setState({ searchText: e.target.value })}
          onSubmit={this.handleSearchSubmit}
        />
        <div className="content deep">
          { this.props.dataIsReady
            ? (
              <div className="content__search">
                <div className="search__query">以下为"{query}"的搜索结果:</div>
                <div className="search__collection">
                  <div className="collection__header">
                    <span>相册</span>
                  </div>
                  { this.renderCollResults() }
                </div>
                <div className="search__user">
                  <div className="user__header">
                    <span>用户</span>
                  </div>
                  { this.renderUserResults() }
                </div>
              </div>
            )
            : (<Loading />) }
        </div>
      </div>
    );
  }
}

ResultsPage.displayName = 'ResultsPage';

ResultsPage.defaultProps = {
  dataIsReady: false,
  users: [],
  collections: [],
};

ResultsPage.propTypes = {
  User: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  // Below Pass from Database
  dataIsReady: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  collections: PropTypes.array.isRequired,
};
