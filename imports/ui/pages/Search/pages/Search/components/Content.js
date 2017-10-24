import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import CollHolder from '/imports/ui/components/CollHolder';

export default class SearchContent extends Component {
  static propTypes = {
    User: PropTypes.object, // not required bc guest can visit this page
    dataIsReady: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
  }

  render() {
    const { dataIsReady, User, users, collections } = this.props;
    return (
      <ContentLayout
        loading={!dataIsReady}
        deep
      >
        <div className="content__search">
          <section className="search__collection">
            <header className="collection__header">
              <span>精选相册</span>
              {/* <a>展开</a> */}
            </header>
            {
              dataIsReady && collections.map((coll) => {
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
                dataIsReady && users.map((user) => (
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
      </ContentLayout>
    );
  }
}
