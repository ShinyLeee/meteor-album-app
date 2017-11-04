import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Popover from 'material-ui/Popover';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import MessageIcon from 'material-ui-icons/Message';
import SettingsIcon from 'material-ui-icons/Settings';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import { followUser, unFollowUser } from '/imports/api/users/methods';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import { rWidth } from '/imports/utils/responsive';
import ImageSlider from './ImageSlider';

export default class UserContent extends PureComponent {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
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
    return User && curUser.profile.followers.indexOf(User.username) >= 0;
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

  renderPopover = (e) => {
    this.setState({
      popover: true,
      anchorEl: e.currentTarget,
    });
  }

  render() {
    const {
      dataIsReady,
      isOwner,
      curUser,
      counts,
      topImages,
      classes,
    } = this.props;
    return (
      <ContentLayout
        loading={!dataIsReady}
        delay
      >
        <div className="content__user">
          { /* MAIN SECTION */ }
          <section className="user__main">
            <div
              className="main__cover"
              style={{ backgroundImage: `url("${curUser.profile.cover}"),url("${curUser.profile.cover}?imageView2/2/w/${rWidth}")` }}
            >
              <div className="main__background" />
            </div>
            <div className="main__profile">
              <div className="main__avatar">
                <img src={curUser.profile.avatar} alt={curUser.username} />
              </div>
              <div className="main__detail">
                <h4>{curUser.username}</h4>
                <span>{curUser.profile.intro || '暂无简介'}</span>
              </div>
            </div>
            <div className="flex-box">
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
                      <ListItem onClick={this.props.userLogout}>
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
          </section>
          { /* COUNTER SECTION */ }
          <section className="user__counter">
            <div
              className="counter counter__likes"
              role="button"
              tabIndex={-1}
              onClick={this._navTo(`/user/${curUser.username}/likes`)}
            >
              <span>{counts.likes}</span>
              <span>喜欢</span>
            </div>
            <div
              className="counter counter__collections"
              role="button"
              tabIndex={-1}
              onClick={this._navTo(`/user/${curUser.username}/collection`)}
            >
              <span>{counts.colls}</span>
              <span>相册</span>
            </div>
            <div
              className="counter counter__follwer"
              role="button"
              tabIndex={-1}
              onClick={this._navTo(`/user/${curUser.username}/fans`)}
            >
              <span>{counts.followers}</span>
              <span>关注者</span>
            </div>
          </section>
          { /* RANK SECTION */ }
          {
            topImages.length > 0 && (
              <section className="user__rank">
                <ImageSlider
                  curUser={curUser}
                  images={topImages}
                />
              </section>
            )
          }
        </div>
      </ContentLayout>
    );
  }
}
