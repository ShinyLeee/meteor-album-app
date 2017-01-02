import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
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
import { Images } from '/imports/api/images/image.js';
import { Collections } from '/imports/api/collections/collection.js';
import { Notes } from '/imports/api/notes/note.js';
import { followUser, unFollowUser } from '/imports/api/users/methods.js';
import ConnectedNavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import { snackBarOpen } from '/imports/ui/redux/actions/actionTypes.js';

const domain = Meteor.settings.public.domain;

class UserPage extends Component {

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
    const { User, curUser } = this.props;
    return !!User && curUser.profile.followers.indexOf(User._id) >= 0;
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
    const { dispatch } = this.props;
    Meteor.logout((err) => {
      if (err) {
        dispatch(snackBarOpen('发生未知错误'));
        throw new Meteor.Error(err);
      }
      browserHistory.replace('/login');
      dispatch(snackBarOpen('登出成功'));
    });
  }

  handleFollow() {
    const { User, curUser, dispatch } = this.props;
    if (!User) return dispatch(snackBarOpen('您还尚未登录'));
    return followUser.call({ follower: User._id, target: curUser._id }, (err, res) => {
      if (err) throw new Meteor.Error(err.reason);
      dispatch(snackBarOpen('关注成功'));
      return res;
    });
  }

  handleUnFollow() {
    const { User, curUser, dispatch } = this.props;
    if (!User) return dispatch(snackBarOpen('您还尚未登录'));
    return unFollowUser.call({ unFollower: User._id, target: curUser._id }, (err, res) => {
      if (err) throw new Meteor.Error(err.reason);
      dispatch(snackBarOpen('取消关注成功'));
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
            const src = `${domain}/${curUser.username}/${image.collection}/${image.name}.${image.type}`;
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
                        onTouchTap={() => browserHistory.push('/note')}
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
    const { User, noteNum, dataIsReady, isGuest } = this.props;
    return (
      <div className="container">
        { isGuest
          ? (
            <ConnectedNavHeader
              User={User}
              title="相册"
              iconElementLeft={
                <IconButton onTouchTap={() => browserHistory.goBack()}>
                  <ArrowBackIcon />
                </IconButton>
              }
            />)
          : (<ConnectedNavHeader User={User} location={this.state.location} noteNum={noteNum} primary />)
        }
        <div className="content">
          { dataIsReady ? this.renderUserContent() : this.renderLoader() }
        </div>
      </div>
    );
  }

}

UserPage.propTypes = {
  User: PropTypes.object,
  dispatch: PropTypes.func,
  // Below pass from database
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  curUser: PropTypes.object.isRequired,
  unOrderedImages: PropTypes.array.isRequired,
  likedCount: PropTypes.number.isRequired,
  collectionCount: PropTypes.number.isRequired,
  noteNum: PropTypes.number.isRequired,
};

const MeteorContainer = createContainer(({ params }) => {
  const { username } = params;
  const User = Meteor.user();
  let isGuest = !User;  // if User is null, isGuest is true
  // if User exist and its name equal with params.username, isGuest is false
  if (User && User.username === username) isGuest = false;
  else isGuest = true;

  const userHandler = Meteor.subscribe('Users.all');
  const imageHandler = Meteor.subscribe('Images.all');
  const collectionHandler = Meteor.subscribe('Collections.targetUser', username);
  const noteHandler = Meteor.subscribe('Notes.own');

  let dataIsReady = false;
  let unOrderedImages = [];
  let likedCount = 0;
  let collectionCount = 0;
  let noteNum = 0;
  const userIsReady = userHandler.ready();
  const curUser = Meteor.users.findOne({ username }) || {};
  if (userIsReady) {
    const uid = curUser._id;
    dataIsReady = imageHandler.ready() && collectionHandler.ready() && noteHandler.ready();
    likedCount = Images.find({ liker: { $in: [uid] } }).count();
    unOrderedImages = Images.find({ uid }, { limit: 10 }).fetch();
    collectionCount = Collections.find().count();
    noteNum = Notes.find({ isRead: { $ne: true } }).count();
  }
  return {
    dataIsReady,
    isGuest,
    curUser,
    unOrderedImages,
    likedCount,
    collectionCount,
    noteNum,
  };
}, UserPage);

export default connect()(MeteorContainer);
