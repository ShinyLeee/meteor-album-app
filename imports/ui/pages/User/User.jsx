import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import { followUser, unFollowUser } from '/imports/api/users/methods.js';
import NavHeader from '../../components/NavHeader/NavHeader.jsx';
import Loading from '../../components/Loader/Loading.jsx';
import TopImageSlider from './components/TopImageSlider/TopImageSlider.jsx';

export default class UserPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: 'user',
      popOpen: false,
    };
    this.handleOpenPopup = this.handleOpenPopup.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnFollow = this.handleUnFollow.bind(this);
  }

  get isFollowed() {
    return !!this.props.User && this.props.curUser.profile.followers.indexOf(this.props.User.username) >= 0;
  }

  get sendNoteLink() {
    const link = this.props.isGuest ? `/sendNote?receiver=${this.props.curUser.username}` : '/sendNote';
    return link;
  }

  handleOpenPopup(e) {
    e.preventDefault();
    this.setState({
      popOpen: true,
      anchorEl: e.currentTarget,
    });
  }

  handleLogout() {
    const logoutPromise = Meteor.wrapPromise(Meteor.logout);
    logoutPromise()
    .then(() => {
      this.props.snackBarOpen('登出成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '发生未知错误');
      throw new Meteor.Error(err);
    });
  }

  handleFollow() {
    if (!this.props.User) {
      this.props.snackBarOpen('您还尚未登录');
      return;
    }
    followUser.callPromise({ targetId: this.props.curUser._id })
    .then(() => {
      this.props.snackBarOpen('关注成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen('关注失败');
      throw new Meteor.Error(err);
    });
  }

  handleUnFollow() {
    if (!this.props.User) {
      this.props.snackBarOpen('您还尚未登录');
      return;
    }
    unFollowUser.callPromise({ targetId: this.props.curUser._id })
    .then(() => {
      this.props.snackBarOpen('取消关注成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen('取消关注失败');
      throw new Meteor.Error(err);
    });
  }

  renderContent() {
    const {
      domain,
      clientWidth,
      devicePixelRatio,
      isGuest,
      curUser,
      likedCount,
      collectionCount,
      unOrderedImages,
    } = this.props;

    // sort by likers length --> for TopImageSlider component
    const topImages = unOrderedImages.sort((p, n) => n.liker.length - p.liker.length);
    const realDimension = Math.round(clientWidth * devicePixelRatio);
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
              onTouchTap={() => browserHistory.push(this.sendNoteLink)}
              style={{ marginRight: '20px' }}
              primary
            />
            {
              isGuest
              ? (
                <RaisedButton
                  label={this.isFollowed ? '取消关注' : '关注'}
                  onTouchTap={this.isFollowed ? this.handleUnFollow : this.handleFollow}
                  secondary
                />
                )
              : (
                <div style={{ display: 'inline-block' }}>
                  <RaisedButton
                    label="更多操作"
                    onTouchTap={this.handleOpenPopup}
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
                        onTouchTap={() => browserHistory.push(`/note/${curUser.username}`)}
                        leftIcon={<MessageIcon />}
                      />
                      <MenuItem
                        primaryText="账号设置"
                        onTouchTap={() => browserHistory.push('/setting')}
                        leftIcon={<SettingsIcon />}
                      />
                      <MenuItem
                        primaryText="登出"
                        leftIcon={<ExitToAppIcon />}
                        onTouchTap={this.handleLogout}
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
            onTouchTap={() => browserHistory.push(`/user/${curUser.username}/likes`)}
          >
            <span>{likedCount}</span>
            <span>喜欢</span>
          </div>
          <div
            className="counter counter__collections"
            onTouchTap={() => browserHistory.push(`/user/${curUser.username}/collection`)}
          >
            <span>{collectionCount}</span>
            <span>相册</span>
          </div>
          <div
            className="counter counter__follwer"
            onTouchEnd={() => browserHistory.push(`/user/${curUser.username}/fans`)}
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
                  domain={domain}
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
          ? (<NavHeader title={`${this.props.curUser.username}的主页`} secondary />)
          : (<NavHeader User={this.props.User} location={this.state.location} primary />)
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

UserPage.displayName = 'UserPage';

UserPage.defaultProps = {
  domain: Meteor.settings.public.imageDomain,
  clientWidth: document.body.clientWidth,
  devicePixelRatio: window.devicePixelRatio,
};

UserPage.propTypes = {
  User: PropTypes.object,
  domain: PropTypes.string.isRequired,
  clientWidth: PropTypes.number.isRequired,
  devicePixelRatio: PropTypes.number.isRequired,
  // Below Pass from database
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  curUser: PropTypes.object.isRequired,
  unOrderedImages: PropTypes.array.isRequired,
  likedCount: PropTypes.number.isRequired,
  collectionCount: PropTypes.number.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
