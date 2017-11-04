import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import CollList from '/imports/ui/components/CollList';

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
        <div className="content__search">
          <section className="search__collection">
            <header className="collection__header">
              <span>精选相册</span>
              {/* <a>展开</a> */}
            </header>
            { dataIsReady && <CollList colls={collections} />}
          </section>
          <section className="search__user">
            <header className="user__header">
              <span>精选用户</span>
              {/* <a>展开</a> */}
            </header>
            {
              dataIsReady && (
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
              )
            }
          </section>
        </div>
      </ContentLayout>
    );
  }
}
