import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import SearchIcon from 'material-ui/svg-icons/action/search';
import NotificationIcon from 'material-ui/svg-icons/social/notifications';
import HomeIcon from 'material-ui/svg-icons/action/home';
import UserIcon from 'material-ui/svg-icons/action/account-circle';
import CameraIcon from 'material-ui/svg-icons/image/camera';
import ExploreIcon from 'material-ui/svg-icons/action/explore';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import FeedbackIcon from 'material-ui/svg-icons/action/feedback';
import HelpIcon from 'material-ui/svg-icons/action/help';
import { purple500 } from 'material-ui/styles/colors';

const styles = {
  AppBar: {
    position: 'fixed',
    backgroundColor: purple500,
  },
  AppBarTitle: {
    fontSize: '20px',
    cursor: 'pointer',
  },
  AppBarIconElementRight: {
    marginTop: 0,
    marginRight: 0,
  },
  DrawerHeader: {
    padding: '10px 16px 10px 20px',
    fontFamily: 'Microsoft Yahei',
    fontSize: '22px',
  },
  AppBarIcon: {
    top: '8px',
  },
  AppBarIconSvg: {
    width: '28px',
    height: '28px',
    color: '#fff',
  },
  AppBarIconBtnForAvatar: {
    left: '10px',
    bottom: '6px',
    padding: 0,
  },
  AppBarIconBtnForLogin: {
    marginRight: '12px',
  },
  AppBarLoginBtn: {
    margin: '12px 0 0 0',
    color: '#fff',
  },
};

export default class NavHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawer: false,
    };
    this.handlePrimaryTitleTouchTap = this.handlePrimaryTitleTouchTap.bind(this);
  }


  handlePrimaryTitleTouchTap() {
    this.context.router.replace('/');
  }

  renderPrimaryIconRight(User) {
    if (Meteor.loggingIn() || User) {
      const defaultSrc = '//odsiu8xnd.bkt.clouddn.com/vivian/default-avatar.jpg?imageView2/0/w/40/h/40'; // eslint-disable-line
      const avatarSrc = User ? User.profile.avatar : defaultSrc;
      return (
        <div>
          <IconButton
            style={styles.AppBarIcon}
            iconStyle={styles.AppBarIconSvg}
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            style={styles.AppBarIcon}
            iconStyle={styles.AppBarIconSvg}
          >
            <NotificationIcon />
          </IconButton>
          <IconButton
            style={styles.AppBarIconBtnForAvatar}
            containerElement={<Link to="/user" />}
          >
            <Avatar src={avatarSrc} />
          </IconButton>
        </div>
      );
    }
    return (
      <div>
        <IconButton
          style={styles.AppBarIconBtnForLogin}
          iconStyle={styles.AppBarIconSvg}
        >
          <SearchIcon />
        </IconButton>
        <FlatButton
          label="登录"
          style={styles.AppBarLoginBtn}
          backgroundColor="rgba(153, 153, 153, 0.2)"
          hoverColor="rgba(153, 153, 153, 0.4)"
          containerElement={<Link to="/login" />}
        />
      </div>
    );
  }

  renderPrimaryNavHeader() {
    const { User, location } = this.props;
    return (
      <div className="NavHeader-container">
        <AppBar
          style={styles.AppBar}
          title="Gallery +"
          titleStyle={styles.AppBarTitle}
          onLeftIconButtonTouchTap={() => { this.setState({ drawer: true }); }}
          onTitleTouchTap={this.handlePrimaryTitleTouchTap}
          iconElementRight={this.renderPrimaryIconRight(User)}
          iconStyleRight={styles.AppBarIconElementRight}
        />
        <Drawer
          docked={false}
          width={280}
          open={this.state.drawer}
          onRequestChange={(open) => this.setState({ drawer: open })}
        >
          <Subheader style={styles.DrawerHeader}>Vivian Gallery + </Subheader>
          <Divider />
          <Menu width="100%" disableAutoFocus>
            <MenuItem
              leftIcon={<HomeIcon color={location === 'home' ? purple500 : ''} />}
              primaryText="首页"
              containerElement={<Link to="/" />}
              style={{ color: location === 'home' ? purple500 : '#000' }}
            />
            <MenuItem
              leftIcon={<UserIcon color={location === 'user' ? purple500 : ''} />}
              primaryText="个人资料"
              containerElement={<Link to="/user" />}
              style={{ color: location === 'user' ? purple500 : '#000' }}
            />
            <MenuItem
              leftIcon={<CameraIcon color={location === 'collection' ? purple500 : ''} />}
              primaryText="收藏集"
              containerElement={<Link to="/collection" />}
              style={{ color: location === 'collection' ? purple500 : '#000' }}
            />
            <MenuItem
              leftIcon={<ExploreIcon color={location === 'explore' ? purple500 : ''} />}
              primaryText="探索"
              containerElement={<Link to="/explore" />}
              style={{ color: location === 'explore' ? purple500 : '#000' }}
            />
          </Menu>
          <Divider />
          <Menu width="100%" disableAutoFocus>
            <MenuItem
              leftIcon={<SettingsIcon color={location === 'setting' ? purple500 : ''} />}
              primaryText="设置"
              containerElement={<Link to="/setting" />}
              style={{ color: location === 'setting' ? purple500 : '#000' }}
            />
            <MenuItem
              leftIcon={<FeedbackIcon />}
              primaryText="反馈"
            />
            <MenuItem
              leftIcon={<HelpIcon />}
              primaryText="帮助"
            />
          </Menu>
        </Drawer>
      </div>
    );
  }

  render() {
    const {
      loading,
      primary,
      title,
      showMenuIconButton,
      onTitleTouchTap,
      iconElementLeft,
      iconElementRight,
      onLeftIconButtonTouchTap,
    } = this.props;

    if (loading) {
      return (
        <AppBar
          style={styles.AppBar}
          titleStyle={styles.AppBarTitle}
          title="登录中..."
        />
      );
    }
    if (primary) {
      return this.renderPrimaryNavHeader();
    }
    return (
      <AppBar
        style={styles.AppBar}
        titleStyle={styles.AppBarTitle}
        title={title}
        showMenuIconButton={showMenuIconButton}
        onTitleTouchTap={onTitleTouchTap}
        iconElementLeft={iconElementLeft}
        iconElementRight={iconElementRight}
        onLeftIconButtonTouchTap={onLeftIconButtonTouchTap}
      />
    );
  }

}

NavHeader.propTypes = {
  loading: PropTypes.bool,
  /**
   * primary:
   *
   * If true, we render a common NavHeader,
   *   LeftIcon is Menu Icon --> click activate Drawer,
   *   Title is Gallery +,
   *   RightIcon is Search & Notification & Avatar,
   *
   * if false, we need to set icon & title by yourself,
   */
  primary: PropTypes.bool,
  /**
   * location:
   *
   * Render different NavHeader acting style,
   * When Primary prop is True.
   * Accroding to location's specfic value.
   */
  location: PropTypes.string,
  /**
   * User:
   *
   * Current User, display avatar
   */
  User: PropTypes.object,
  /**
   * Below:
   *
   * The below props are all pass to AppBar Component,
   * when primary is false.
   */
  title: PropTypes.string,
  showMenuIconButton: PropTypes.bool,
  onTitleTouchTap: PropTypes.func,
  iconElementLeft: PropTypes.element,
  iconElementRight: PropTypes.element,
  onLeftIconButtonTouchTap: PropTypes.func,
};

// If contextTypes is not defined, then context will be an empty object.
NavHeader.contextTypes = {
  router: PropTypes.object.isRequired,
};
