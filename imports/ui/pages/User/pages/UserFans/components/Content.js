import map from 'lodash/map';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import List from 'material-ui/List/List';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import { followUser, unFollowUser } from '/imports/api/users/methods';
import FanListItem from '../containers/FanListItemContainer';
import { SearchSection } from '../styles';

export default class UserFansContent extends PureComponent {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    fans: PropTypes.array.isRequired,
    User: PropTypes.object, // not required bc guest can visit this page
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    wholeFans: this.props.fans,
    fans: this.props.fans,
  }

  _handleSearchChange = (e) => {
    const value = e.target.value;
    const filteredFans = this.state.wholeFans.filter(fan => fan.toLowerCase().indexOf(value) !== -1);
    this.setState({ fans: filteredFans });
  }

  _handleToggleFollow = async (isFollowed, fanObject) => {
    const { User } = this.props;
    if (!User) {
      this.props.snackBarOpen('您还尚未登录');
      return;
    }
    const api = isFollowed ? unFollowUser : followUser;
    const data = {
      targetId: fanObject._id,
      targetName: fanObject.username,
    };
    try {
      await api.callPromise(data);
      this.props.snackBarOpen(`${isFollowed ? '取消关注' : '关注'}成功`);
    } catch (err) {
      console.warn(err);
      this.props.snackBarOpen(`${isFollowed ? '取消关注' : '关注'}失败 ${err.reason}`);
    }
  }

  renderFansList() {
    if (this.state.wholeFans.length === 0) {
      return <p className="text-center">暂无关注者</p>;
    }
    if (this.state.fans.length === 0) {
      return <p className="text-center">未找到用户</p>;
    }
    return (
      <List>
        {
          map(this.state.fans, (fan) => (
            <FanListItem
              key={fan}
              fan={fan}
              onToggleFollow={this._handleToggleFollow}
            />
          ))
        }
      </List>
    );
  }

  render() {
    const { dataIsReady } = this.props;
    return (
      <ContentLayout
        loading={!dataIsReady}
        delay
      >
        <SearchSection>
          <input type="text" placeholder="搜索" onChange={this._handleSearchChange} />
        </SearchSection>
        <section>
          { this.renderFansList() }
        </section>
      </ContentLayout>
    );
  }
}
