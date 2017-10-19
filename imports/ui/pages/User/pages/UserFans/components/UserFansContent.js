import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import { followUser, unFollowUser } from '/imports/api/users/methods';

export default class UserFansContent extends PureComponent {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired, // based on isOwner render different content
    initialFans: PropTypes.array.isRequired,
    User: PropTypes.object, // not required bc guest can visit this page
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  state = {
    wholeFans: this.props.initialFans,
    fans: this.props.initialFans,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialFans !== nextProps.initialFans) {
      this.setState({ fans: nextProps.initialFans });
    }
  }

  _handleSearchChange = (e) => {
    const filteredFans = this.state.wholeFans.filter((fan) => fan.toLowerCase().indexOf(e.target.value) !== -1);
    this.setState({ fans: filteredFans });
  }

  _handleFollow = (isFollowed, fanObject) => {
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
    api.callPromise(data)
      .then(() => {
        this.props.snackBarOpen(`${isFollowed ? '取消关注' : '关注'}成功`);
      })
      .catch((err) => {
        console.log(err);
        this.props.snackBarOpen(`${isFollowed ? '取消关注' : '关注'}失败 ${err.reason}`);
      });
  }

  renderFansList() {
    if (this.state.wholeFans.length === 0) {
      return <p className="text-center">暂无关注者</p>;
    }
    if (this.state.fans.length === 0) {
      return <p className="text-center">未找到用户</p>;
    }
    return this.state.fans.map((fan) => {
      const { isOwner, User, history, classes } = this.props;
      const fanObject = Meteor.users.findOne({ username: fan });
      const isFollowed = isOwner && fanObject.profile.followers.indexOf(User.username) !== -1;
      return (
        <List key={fan} className="userFans__listItem">
          <ListItem disableRipple button>
            <Avatar
              src={_.get(fanObject, 'profile.avatar')}
              onClick={() => history.push(`/user/${_.get(fanObject, 'username')}`)}
            />
            <ListItemText
              primary={_.get(fanObject, 'username')}
              secondary={_.get(fanObject, 'profile.nickname')}
            />
            <Button
              className={isFollowed ? classes.btn__blue : classes.btn__white}
              onClick={() => this._handleFollow(isFollowed, fanObject)}
              disableRipple
              raised
            >
              { isFollowed ? '已关注' : '关注' }
            </Button>
          </ListItem>
          <Divider inset />
        </List>
      );
    });
  }

  render() {
    const { dataIsReady } = this.props;
    return (
      <ContentLayout loading={!dataIsReady}>
        {
          dataIsReady && (
            <div className="content__userFans">
              <section className="userFans__search">
                <input type="text" placeholder="搜索" onChange={this._handleSearchChange} />
              </section>
              <section className="userFans__list">
                { this.renderFansList() }
              </section>
            </div>
          )
        }
      </ContentLayout>
    );
  }
}
