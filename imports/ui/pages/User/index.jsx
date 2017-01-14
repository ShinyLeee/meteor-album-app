import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Slider from 'react-slick';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import { followUser, unFollowUser } from '/imports/api/users/methods.js';

import NavHeader from '../../components/NavHeader/NavHeader.jsx';

export default class UserPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: 'user',
      open: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnFollow = this.handleUnFollow.bind(this);
  }

  get isFollowed() {
    return !!this.props.User && this.props.curUser.profile.followers.indexOf(this.props.User._id) >= 0;
  }

  get sendNoteLink() {
    const link = this.props.isGuest ? `/sendNote?receiver=${this.props.curUser.username}` : '/sendNote';
    return link;
  }

  handleOpen(e) {
    e.preventDefault();
    this.setState({ open: true });
  }

  handleLogout() {
    Meteor.logout((err) => {
      if (err) {
        this.props.snackBarOpen('发生未知错误');
        throw new Meteor.Error(err);
      }
      browserHistory.replace('/login');
      this.props.snackBarOpen('登出成功');
    });
  }

  handleFollow() {
    if (!this.props.User) return this.props.snackBarOpen('您还尚未登录');
    return followUser.call({ target: this.props.curUser._id }, (err, res) => {
      if (err) throw new Meteor.Error(err.reason);
      this.props.snackBarOpen('关注成功');
      return res;
    });
  }

  handleUnFollow() {
    if (!this.props.User) return this.props.snackBarOpen('您还尚未登录');
    return unFollowUser.call({ target: this.props.curUser._id }, (err, res) => {
      if (err) throw new Meteor.Error(err.reason);
      this.props.snackBarOpen('取消关注成功');
      return res;
    });
  }

  renderLoader() {
    return (
      <div className="content text-center">
        <CircularProgress style={{ top: '150px' }} />
      </div>
    );
  }

  renderSlider() {
    const { curUser, unOrderedImages } = this.props;
    const topImages = unOrderedImages.sort((p, n) => n.liker.length - p.liker.length);
    return (
      <Slider
        slidesToScroll={3}
        slidesToShow={3}
        speed={500}
        infinite={false}
      >
        {
          topImages.map((image, i) => {
            const src = `${this.props.domain}/${curUser.username}/${image.collection}/${image.name}.${image.type}`;
            return (
              <div key={i} style={{ padding: '10px' }}>
                <img style={{ width: '100%' }} src={`${src}?imageView2/1/w/240/h/300`} alt={image.name} />
              </div>
            );
          })
        }
      </Slider>);
  }

  renderUserContent() {
    const profileContentLeft = (document.body.clientWidth - 120) / 2;
    const { isGuest, curUser, likedCount, collectionCount, unOrderedImages } = this.props;
    return (
      <div className="user-content">
        { /* MAIN SECTION */ }
        <div className="user-main">
          <div
            className="main-cover"
            style={{ backgroundImage: `url(${curUser.profile.cover})` }}
          >
            <div className="main-cover-background" />
          </div>
          <div className="main-profile">
            <div
              className="main-profile-content"
              style={{ left: `${profileContentLeft}px` }}
            >
              <div className="main-profile-avatar">
                <img src={curUser.profile.avatar} alt={curUser.username} />
              </div>
              <div className="main-profile-detail">
                <h4>{curUser.username}</h4>
                <span>{curUser.profile.intro || '暂无简介'}</span>
              </div>
            </div>
          </div>
          <div className="main-action">
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
                    onTouchTap={this.handleOpen}
                  />
                  <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    onRequestClose={() => this.setState({ open: false })}
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
        </div>
        { /* COUNTER SECTION */ }
        <div className="user-counter">
          <div className="counter counter-likes">
            <span>{likedCount}</span>
            <span>喜欢</span>
          </div>
          <div
            className="counter counter-collections"
            onTouchTap={() => browserHistory.push(`/user/${curUser.username}/collection`)}
          >
            <span>{collectionCount}</span>
            <span>相册</span>
          </div>
          <div className="counter counter-follwer">
            <span>{curUser.profile.followers.length}</span>
            <span>粉丝</span>
          </div>
        </div>
        { /* RANK SECTION */ }
        {
          unOrderedImages.length > 0 && (
            <div className="user-rank">
              <div className="rank-header">最受欢迎的</div>
              <div className="rank-content">
                { this.renderSlider() }
              </div>
            </div>
          )
        }

      </div>
    );
  }

  render() {
    return (
      <div className="container">
        { this.props.isGuest
          ? (
            <NavHeader
              User={this.props.User}
              title="相册"
              iconElementLeft={
                <IconButton onTouchTap={() => browserHistory.goBack()}>
                  <ArrowBackIcon />
                </IconButton>
              }
            />)
          : (
            <NavHeader
              User={this.props.User}
              location={this.state.location}
              noteNum={this.props.noteNum}
              snackBarOpen={this.props.snackBarOpen}
              primary
            />)
        }
        <div className="content">
          { this.props.dataIsReady ? this.renderUserContent() : this.renderLoader() }
        </div>
      </div>
    );
  }

}

UserPage.defaultProps = {
  domain: Meteor.settings.public.domain,
};

UserPage.propTypes = {
  User: PropTypes.object,
  domain: PropTypes.string.isRequired,
  // Below Pass from database
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  curUser: PropTypes.object.isRequired,
  unOrderedImages: PropTypes.array.isRequired,
  likedCount: PropTypes.number.isRequired,
  collectionCount: PropTypes.number.isRequired,
  noteNum: PropTypes.number.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
