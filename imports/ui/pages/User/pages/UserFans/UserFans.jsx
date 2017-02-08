import { Meteor } from 'meteor/meteor';
import React, { PureComponent, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import { blueA400 } from 'material-ui/styles/colors';
import { followUser, unFollowUser } from '/imports/api/users/methods.js';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';

export default class UserFansPage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      wholeFans: props.initialFans,
      fans: props.initialFans,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnFollow = this.handleUnFollow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.initialFans && nextProps.initialFans) {
      this.setState({ fans: nextProps.initialFans });
    }
  }

  handleSearchChange(e) {
    const filteredFans = this.state.wholeFans.filter((fan) => fan.toLowerCase().indexOf(e.target.value) !== -1);
    this.setState({ fans: filteredFans });
  }

  handleFollow(e, fanObject) {
    e.preventDefault();
    if (!this.props.User) {
      this.props.snackBarOpen('您还尚未登录');
      return;
    }
    followUser.callPromise({ targetId: fanObject._id })
    .then(() => {
      this.props.snackBarOpen('关注成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen('关注失败');
      throw new Meteor.Error(err);
    });
  }

  handleUnFollow(e, fanObject) {
    e.preventDefault();
    if (!this.props.User) {
      this.props.snackBarOpen('您还尚未登录');
    }
    unFollowUser.callPromise({ targetId: fanObject._id })
    .then(() => {
      this.props.snackBarOpen('取消关注成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen('取消关注失败');
      throw new Meteor.Error(err);
    });
  }

  renderListItem(fanObject) {
    const { isGuest, User } = this.props;
    if (isGuest || fanObject.profile.followers.indexOf(User.username) === -1) {
      return (
        <ListItem
          leftAvatar={<Avatar src={fanObject && fanObject.profile.avatar} />}
          rightIconButton={
            <RaisedButton
              label="关注"
              style={{ top: '' }}
              buttonStyle={{ backgroundColor: blueA400 }}
              onTouchTap={(e) => this.handleFollow(e, fanObject)}
              primary
            />
          }
          primaryText={fanObject.username}
          secondaryText={fanObject.profile.nickname}
          onTouchTap={() => browserHistory.push(`/user/${fanObject.username}`)}
        />
      );
    }
    return (
      <ListItem
        leftAvatar={<Avatar src={fanObject && fanObject.profile.avatar} />}
        rightIconButton={
          <RaisedButton
            label="已关注"
            style={{ top: '' }}
            onTouchTap={(e) => this.handleUnFollow(e, fanObject)}
          />
        }
        primaryText={fanObject.username}
        secondaryText={fanObject.profile.nickname}
        onTouchTap={() => browserHistory.push(`/user/${fanObject.username}`)}
      />
    );
  }

  renderFansList() {
    if (this.state.wholeFans.length === 0) return <div className="userFans__emptyItem">暂无关注者</div>;
    if (this.state.fans.length === 0) return <div className="userFans__emptyItem">未找到用户</div>;
    return this.state.fans.map((fan, i) => {
      const fanObject = Meteor.users.findOne({ username: fan });
      return (
        <div key={i} className="userFans__listItem">
          { this.renderListItem(fanObject) }
          <Divider inset />
        </div>
      );
    });
  }

  render() {
    return (
      <div className="container">
        <NavHeader
          title={this.props.isGuest ? `${this.props.curUser.username}的关注者` : '我的关注者'}
          secondary
        />
        { !this.props.dataIsReady && (<Loading />) }
        <div className="content">
          { this.props.dataIsReady && (
            <div className="content__userFans">
              <div className="userFans__search">
                <input type="text" placeholder="搜索" onChange={this.handleSearchChange} />
              </div>
              <List className="userFans__list">
                { this.renderFansList() }
              </List>
            </div>
            )
          }
        </div>
      </div>
    );
  }
}

UserFansPage.displayName = 'UserFansPage';

UserFansPage.propTypes = {
  User: PropTypes.object, // not required bc guest can visit this page
  // Below Pass from Database
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired, // based on isGuest render different content
  curUser: PropTypes.object.isRequired,
  initialFans: PropTypes.array.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
