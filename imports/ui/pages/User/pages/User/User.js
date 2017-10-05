import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Popover from 'material-ui/Popover';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import MessageIcon from 'material-ui-icons/Message';
import SettingsIcon from 'material-ui-icons/Settings';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import teal from 'material-ui/colors/teal';
import { followUser, unFollowUser } from '/imports/api/users/methods.js';
import { vWidth, rWidth } from '/imports/utils/responsive';
import RootLayout from '/imports/ui/layouts/RootLayout';
import { PrimaryNavHeader, SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import TopImageSlider from '../../components/TopImageSlider';

const teal500 = teal[500];

class UserPage extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    User: PropTypes.object,
    dataIsReady: PropTypes.bool.isRequired,
    isGuest: PropTypes.bool.isRequired,
    curUser: PropTypes.object.isRequired,
    unOrderedImages: PropTypes.array.isRequired,
    likedCount: PropTypes.number.isRequired,
    collectionCount: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    userLogout: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    popover: false,
  }

  get isFollowed() {
    const { User, curUser } = this.props;
    return !!User && curUser.profile.followers.indexOf(User.username) >= 0;
  }

  get sendNoteLink() {
    const { isGuest, curUser } = this.props;
    const link = isGuest ? `/sendNote?receiver=${curUser.username}` : '/sendNote';
    return link;
  }

  _navTo = (location) => () => {
    this.props.history.push(location);
  }

  _handleOpenPopover = (e) => {
    this.setState({
      popover: true,
      anchorEl: e.currentTarget,
    });
  }

  _handleLogout = () => {
    const logoutPromise = Meteor.wrapPromise(Meteor.logout);
    logoutPromise()
    .then(() => {
      this.props.snackBarOpen('登出成功');
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(err.reason || '发生未知错误');
    });
  }

  _handleFollow = () => {
    const { User, curUser } = this.props;
    if (!User) {
      this.props.snackBarOpen('您还尚未登录');
      return;
    }
    followUser.callPromise({ targetId: curUser._id, targetName: curUser.username })
    .then(() => {
      this.props.userLogout();
      this.props.snackBarOpen('关注成功');
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen('关注失败');
    });
  }

  _handleUnFollow = () => {
    const { User, curUser } = this.prosp;
    if (!User) {
      this.props.snackBarOpen('您还尚未登录');
      return;
    }
    unFollowUser.callPromise({ targetId: curUser._id, targetName: curUser.username })
    .then(() => {
      this.props.snackBarOpen('取消关注成功');
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen('取消关注失败');
    });
  }

  renderContent() {
    const {
      isGuest,
      curUser,
      likedCount,
      collectionCount,
      unOrderedImages,
      classes,
    } = this.props;

    // sort by likers length --> for TopImageSlider component
    const topImages = unOrderedImages.sort((p, n) => n.liker.length - p.liker.length);
    const preCover = `${curUser.profile.cover}?imageView2/2/w/${rWidth}`;
    const trueCover = `${curUser.profile.cover}`;
    return (
      <div className="content__user">
        { /* MAIN SECTION */ }
        <section className="user__main">
          <div
            className="main__cover"
            style={{ backgroundImage: `url("${trueCover}"),url("${preCover}")` }}
          >
            <div className="main__background" />
          </div>
          <div className="main__profile">
            <div
              className="main__content"
              style={{ left: `${(vWidth - 120) / 2}px` }}
            >
              <div className="main__avatar">
                <img src={curUser.profile.avatar} alt={curUser.username} />
              </div>
              <div className="main__detail">
                <h4>{curUser.username}</h4>
                <span>{curUser.profile.intro || '暂无简介'}</span>
              </div>
            </div>
          </div>
          <div className="main__action">
            <Button
              className={classes.btn__left}
              onClick={this._navTo(this.sendNoteLink)}
              color="primary"
              raised
            >{isGuest ? '发送私信' : '发送信息'}
            </Button>
            {
              isGuest
              ? (
                <Button
                  onClick={this.isFollowed ? this._handleUnFollow : this._handleFollow}
                  color="accent"
                  raised
                >
                  {this.isFollowed ? '取消关注' : '关注'}
                </Button>
                )
              : (
                <div style={{ display: 'inline-block' }}>
                  <Button
                    className={classes.btn__more}
                    onClick={this._handleOpenPopover}
                    raised
                  >更多操作
                  </Button>
                  <Popover
                    open={this.state.popover}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'top', vertical: 'left' }}
                    transformOrigin={{ horizontal: 'bottom', vertical: 'left' }}
                    onRequestClose={() => this.setState({ popover: false })}
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
                  </Popover>
                </div>
              )
            }
          </div>
        </section>
        { /* COUNTER SECTION */ }
        <section className="user__counter">
          <div
            className="counter counter__likes"
            onClick={this._navTo(`/user/${curUser.username}/likes`)}
          >
            <span>{likedCount}</span>
            <span>喜欢</span>
          </div>
          <div
            className="counter counter__collections"
            onClick={this._navTo(`/user/${curUser.username}/collection`)}
          >
            <span>{collectionCount}</span>
            <span>相册</span>
          </div>
          <div
            className="counter counter__follwer"
            onClick={this._navTo(`/user/${curUser.username}/fans`)}
          >
            <span>{curUser.profile.followers.length}</span>
            <span>关注者</span>
          </div>
        </section>
        { /* RANK SECTION */ }
        {
          unOrderedImages.length > 0 && (
            <section className="user__rank">
              <div className="rank__header">最受欢迎的</div>
              <div className="rank__content">
                <TopImageSlider
                  curUser={curUser}
                  topImages={topImages}
                />
              </div>
            </section>
          )
        }
      </div>
    );
  }

  render() {
    const { isGuest, curUser, dataIsReady } = this.props;
    return (
      <RootLayout
        loading={!dataIsReady}
        Topbar={
          isGuest
          ? <SecondaryNavHeader title={`${curUser.username}的主页`} />
          : <PrimaryNavHeader style={{ backgroundColor: teal500 }} />
        }
      >
        { dataIsReady && this.renderContent() }
      </RootLayout>
    );
  }
}

const styles = {
  btn__left: {
    marginRight: 20,
  },

  btn__more: {
    backgroundColor: '#fff',
  },
};

export default withStyles(styles)(UserPage);
