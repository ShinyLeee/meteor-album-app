import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import { teal500 } from 'material-ui/styles/colors.js';
import { followUser, unFollowUser } from '/imports/api/users/methods.js';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary/Primary.jsx';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary/Secondary.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import TopImageSlider from './components/TopImageSlider/TopImageSlider.jsx';

export default class UserPage extends Component {
  static propTypes = {
    // Below Pass from React-Router
    history: PropTypes.object.isRequired,
    // Below Pass from database
    User: PropTypes.object,
    dataIsReady: PropTypes.bool.isRequired,
    isGuest: PropTypes.bool.isRequired,
    curUser: PropTypes.object.isRequired,
    unOrderedImages: PropTypes.array.isRequired,
    likedCount: PropTypes.number.isRequired,
    collectionCount: PropTypes.number.isRequired,
    // Below Pass from Redux
    userLogout: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this._clientWidth = document.body.clientWidth;
    this._pixelRatio = window.devicePixelRatio;
    this.state = {
      location: 'user',
      popOpen: false,
    };
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

  _handleOpenPopup = (e) => {
    e.preventDefault();
    this.setState({
      popOpen: true,
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
      history,
      isGuest,
      curUser,
      likedCount,
      collectionCount,
      unOrderedImages,
    } = this.props;

    // sort by likers length --> for TopImageSlider component
    const topImages = unOrderedImages.sort((p, n) => n.liker.length - p.liker.length);
    const realDimension = Math.round(this._clientWidth * this._pixelRatio);
    const preCover = `${curUser.profile.cover}?imageView2/2/w/${realDimension}`;
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
              style={{ left: `${(document.body.clientWidth - 120) / 2}px` }}
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
            <RaisedButton
              label={isGuest ? '发送私信' : '发送信息'}
              onTouchTap={() => history.push(this.sendNoteLink)}
              style={{ marginRight: '20px' }}
              primary
            />
            {
              isGuest
              ? (
                <RaisedButton
                  label={this.isFollowed ? '取消关注' : '关注'}
                  onTouchTap={this.isFollowed ? this._handleUnFollow : this._handleFollow}
                  secondary
                />
                )
              : (
                <div style={{ display: 'inline-block' }}>
                  <RaisedButton
                    label="更多操作"
                    onTouchTap={this._handleOpenPopup}
                  />
                  <Popover
                    open={this.state.popOpen}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
                    onRequestClose={() => this.setState({ popOpen: false })}
                  >
                    <Menu>
                      <MenuItem
                        primaryText="我的信息"
                        onTouchTap={() => history.push(`/note/${curUser.username}`)}
                        leftIcon={<MessageIcon />}
                      />
                      <MenuItem
                        primaryText="账号设置"
                        onTouchTap={() => history.push('/setting')}
                        leftIcon={<SettingsIcon />}
                      />
                      <MenuItem
                        primaryText="登出"
                        leftIcon={<ExitToAppIcon />}
                        onTouchTap={this._handleLogout}
                      />
                    </Menu>
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
            onTouchTap={() => history.push(`/user/${curUser.username}/likes`)}
          >
            <span>{likedCount}</span>
            <span>喜欢</span>
          </div>
          <div
            className="counter counter__collections"
            onTouchTap={() => history.push(`/user/${curUser.username}/collection`)}
          >
            <span>{collectionCount}</span>
            <span>相册</span>
          </div>
          <div
            className="counter counter__follwer"
            onTouchEnd={() => history.push(`/user/${curUser.username}/fans`)}
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
    return (
      <div className="container">
        {
          this.props.isGuest
          ? (<SecondaryNavHeader title={`${this.props.curUser.username}的主页`} />)
          : (
            <PrimaryNavHeader
              location={this.state.location}
              style={{ backgroundColor: teal500 }}
            />)
        }
        <main className="content">
          {
            this.props.dataIsReady
            ? this.renderContent()
            : (<Loading />)
          }
        </main>
      </div>
    );
  }
}
