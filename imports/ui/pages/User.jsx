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
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import { Images } from '/imports/api/images/image.js';
import { Collections } from '/imports/api/collections/collection.js';
import NavHeader from '../components/NavHeader.jsx';
import { snackBarOpen } from '../actions/actionTypes.js';

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

  renderLoader() {
    return (
      <div className="text-center"><CircularProgress /></div>
    );
  }

  renderSlider() {
    const { User, topImages } = this.props;
    return (
      <Slider
        slidesToScroll={3}
        slidesToShow={3}
        speed={500}
        infinite={false}
      >
        {
          topImages.map((image, i) => {
            const src = `${domain}/${User.username}/${image.collection}/${image.name}.${image.type}`;
            return (
              <div style={{ padding: '10px' }} key={i}>
                <img style={{ width: '100%' }} src={`${src}?imageView2/1/w/240/h/300`} alt={image.name} />
              </div>
            );
          })
        }
      </Slider>);
  }

  renderUserContent() {
    const profileContentLeft = (document.body.clientWidth - 120) / 2;
    const { User, likedCount, collectionCount, dataIsReady } = this.props;
    return (
      <div className="user-content">
        { /* MAIN SECTION */ }
        <div className="user-main">
          <div
            className="main-cover"
            style={{ backgroundImage: `url(${User.profile.cover})` }}
          >
            <div className="main-cover-background" />
          </div>
          <div className="main-profile">
            <div
              className="main-profile-content"
              style={{ left: `${profileContentLeft}px` }}
            >
              <div className="main-profile-avatar">
                <img src={User.profile.avatar} alt={User.username} />
              </div>
              <div className="main-profile-detail">
                <h4>{User.username}</h4>
                <span>{User.profile.intro || '暂无简介'}</span>
              </div>
            </div>
          </div>
          <div className="main-action">
            <RaisedButton
              label="发送信息"
              onTouchTap={() => browserHistory.push('/sendNote')}
              style={{ marginRight: '20px' }}
              primary
            />
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
        </div>
        { /* COUNTER SECTION */ }
        <div className="user-counter">
          <div
            className="counter counter-likes"
            onTouchTap={() => browserHistory.push('/likes')}
          >
            <span>{likedCount}</span>
            <span>喜欢</span>
          </div>
          <div
            className="counter counter-collections"
            onTouchTap={() => browserHistory.push('/collection')}
          >
            <span>{collectionCount}</span>
            <span>相册</span>
          </div>
          <div className="counter counter-follwer">
            <span>{User.profile.follwers.length}</span>
            <span>粉丝</span>
          </div>
        </div>
        { /* RANK SECTION */ }
        <div className="user-rank">
          <div className="rank-header">最受欢迎的</div>
          <div className="rank-content">
            { dataIsReady ? this.renderSlider() : this.renderLoader() }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { User } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} primary />
        <div className="content">
          { this.renderUserContent() }
        </div>
      </div>
    );
  }

}

UserPage.propTypes = {
  dataIsReady: PropTypes.bool.isRequired,
  likedCount: PropTypes.number.isRequired,
  collectionCount: PropTypes.number.isRequired,
  topImages: PropTypes.array.isRequired,
  User: PropTypes.object,
  dispatch: PropTypes.func,
};

const MeteorContainer = createContainer(() => {
  const uid = Meteor.userId();
  const imageHandler = Meteor.subscribe('Images.all');
  const collectionHandler = Meteor.subscribe('Collections.own');
  const dataIsReady = imageHandler.ready() && collectionHandler.ready();
  const likedCount = Images.find({ liker: { $in: [uid] } }).count();
  const collectionCount = Collections.find({}).count();
  const topImages = Images.find({}, { sort: { likes: -1 }, limit: 10 }).fetch();
  return {
    dataIsReady,
    likedCount,
    collectionCount,
    topImages,
  };
}, UserPage);

export default connect()(MeteorContainer);
