import debounce from 'lodash/debounce';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import List from 'material-ui/List/List';
import { followUser, unFollowUser } from '/imports/api/users/methods';
import FanListItem from '../containers/FanListItemContainer';
import { SearchSection } from '../styles';

export default class UserFansContent extends PureComponent {
  static propTypes = {
    fans: PropTypes.array.isRequired,
    isLoggedIn: PropTypes.bool.isRequired, // not required bc guest can visit this page
    snackBarOpen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      wholeFans: props.fans,
      fans: props.fans,
    };
    this._debounceUpdateFanList = debounce(this._updateFansList, 300);
  }

  _handleSearchChange = (e) => {
    e.persist();
    const value = e.target.value;
    this._debounceUpdateFanList(value);
  }

  _handleToggleFollow = async (isFollowed, fanObject) => {
    const { isLoggedIn } = this.props;
    if (!isLoggedIn) {
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
      this.props.snackBarOpen(`${isFollowed ? '取消关注' : '关注'}失败 ${err.error}`);
    }
  }

  _updateFansList = (value) => {
    const filteredFans = this.state.wholeFans.filter(
      fan => fan.toLowerCase().indexOf(value) !== -1,
    );
    this.setState({ fans: filteredFans });
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
    return (
      <div>
        <SearchSection>
          <input
            type="text"
            placeholder="搜索"
            onChange={this._handleSearchChange}
          />
        </SearchSection>
        <section>
          { this.renderFansList() }
        </section>
      </div>
    );
  }
}
