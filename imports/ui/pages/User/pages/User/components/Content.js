import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Popover from 'material-ui/Popover';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import MessageIcon from 'material-ui-icons/Message';
import SettingsIcon from 'material-ui-icons/Settings';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import { followUser, unFollowUser } from '/imports/api/users/methods';
import Modal from '/imports/ui/components/Modal';
import { ResponsiveCover } from '/imports/ui/components/ProgressiveImage';
import ImageSlider from './ImageSlider';
import {
  Wrapper,
  MainSection,
  Profile,
  Avatar,
  Detail,
  CounterSection,
  Counter,
  RankSection,
} from '../styles';

export default class UserContent extends PureComponent {
  static propTypes = {
    User: PropTypes.object,
    isOwner: PropTypes.bool.isRequired,
    curUser: PropTypes.object.isRequired,
    topImages: PropTypes.array.isRequired,
    counts: PropTypes.shape({
      likes: PropTypes.number.isRequired,
      colls: PropTypes.number.isRequired,
      followers: PropTypes.number.isRequired,
    }),
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    userLogout: PropTypes.func.isRequired,
  }

  state = {
    popover: false,
  }

  get isFollowed() {
    const { User, curUser } = this.props;
    const followers = get(curUser, 'profile.followers');
    return User && followers && followers.indexOf(User.username) >= 0;
  }

  _navTo = (location) => () => {
    this.props.history.push(location);
  }

  _handleFollow = async () => {
    const { User, curUser } = this.props;
    if (!User) {
      this.props.snackBarOpen('您还尚未登录');
      return;
    }
    try {
      await followUser.callPromise({ targetId: curUser._id, targetName: curUser.username });
      this.props.snackBarOpen('关注成功');
    } catch (err) {
      console.warn(err);
      this.props.snackBarOpen(`关注失败 ${err.reason}`);
    }
  }

  _handleUnFollow = async () => {
    const { User, curUser } = this.props;
    if (!User) {
      this.props.snackBarOpen('您还尚未登录');
      return;
    }
    try {
      await unFollowUser.callPromise({ targetId: curUser._id, targetName: curUser.username });
      this.props.snackBarOpen('取消关注成功');
    } catch (err) {
      console.warn(err);
      this.props.snackBarOpen(`取消关注失败 ${err.reason}`);
    }
  }

  _handleLogout = async () => {
    await Modal.showLoader('登出中');
    await this.props.userLogout();
    Modal.close();
  }

  renderPopover = (e) => {
    this.setState({
      popover: true,
      anchorEl: e.currentTarget,
    });
  }

  render() {
    const {
      isOwner,
      curUser,
      counts,
      topImages,
      classes,
    } = this.props;
    return (
      <Wrapper>
        <ResponsiveCover
          src={get(curUser, 'profile.cover')}
          basis={0.3}
          maxHeight={300}
        />

        { /* MAIN SECTION */ }
        <MainSection>
          <Profile>
            <Avatar>
              <img src={get(curUser, 'profile.avatar')} alt={curUser.username} />
            </Avatar>
            <Detail>
              <h4>{curUser.username}</h4>
              <span>{get(curUser, 'profile.intro') || '暂无简介'}</span>
            </Detail>
          </Profile>
          <div>
            <Button
              className={classes.btn__left}
              onClick={this._navTo(isOwner ? '/sendNote' : `/sendNote?receiver=${curUser.username}`)}
              color="primary"
              raised
            >{ isOwner ? '发送信息' : '发送私信' }
            </Button>
            {
              isOwner
              ? [
                <Button
                  key="btn__more"
                  className={classes.btn__more}
                  onClick={this.renderPopover}
                  raised
                >更多操作
                </Button>,
                <Popover
                  key="Popover"
                  open={this.state.popover}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                  onClose={() => this.setState({ popover: false })}
                >
                  <List>
                    <ListItem onClick={this._navTo(`/note/${curUser.username}`)}>
                      <ListItemIcon><MessageIcon /></ListItemIcon>
                      <ListItemText primary="我的信息" />
                    </ListItem>
                    <ListItem onClick={this._navTo('/setting')}>
                      <ListItemIcon><SettingsIcon /></ListItemIcon>
                      <ListItemText primary="账号设置" />
                    </ListItem>
                    <ListItem onClick={this._handleLogout}>
                      <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                      <ListItemText primary="登出" />
                    </ListItem>
                  </List>
                </Popover>,
                ]
              : (
                <Button
                  onClick={this.isFollowed ? this._handleUnFollow : this._handleFollow}
                  color="accent"
                  raised
                >{this.isFollowed ? '取消关注' : '关注'}
                </Button>
              )
            }
          </div>
        </MainSection>
        { /* COUNTER SECTION */ }
        <CounterSection>
          <Counter onClick={this._navTo(`/user/${curUser.username}/likes`)}>
            <span>{counts.likes}</span>
            <span>喜欢</span>
          </Counter>
          <Counter onClick={this._navTo(`/user/${curUser.username}/collection`)}>
            <span>{counts.colls}</span>
            <span>相册</span>
          </Counter>
          <Counter onClick={this._navTo(`/user/${curUser.username}/fans`)}>
            <span>{counts.followers}</span>
            <span>关注者</span>
          </Counter>
        </CounterSection>
        { /* RANK SECTION */ }
        <RankSection>
          {
            topImages.length > 0 && (
              <ImageSlider
                curUser={curUser}
                images={topImages}
              />
            )
          }
        </RankSection>
      </Wrapper>
    );
  }
}
