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

export default class NavHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawer: false,
    };
    this.handleTitleTouchTap = this.handleTitleTouchTap.bind(this);
  }

  handleTitleTouchTap() {
    this.context.router.replace('/');
  }

  renderIconEleRight(User) {
    const styles = {
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
    if (Meteor.loggingIn() || User) {
      const defaultSrc = 'http://odsiu8xnd.bkt.clouddn.com/vivian/default-avatar.jpg';
      const avatarSrc = this.props.User ? this.props.User.profile.avatar : defaultSrc;
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

  render() {
    const { User, location } = this.props;
    const styles = {
      AppBar: {
        position: 'fixed',
        backgroundColor: purple500,
      },
      AppBarTitle: {
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
    };
    if (location) {
      styles[location] = { color: purple500 };
    }
    return (
      <div className="NavHeader-container">
        <AppBar
          style={styles.AppBar}
          title="Gallery +"
          titleStyle={styles.AppBarTitle}
          onLeftIconButtonTouchTap={() => { this.setState({ drawer: true }); }}
          onTitleTouchTap={this.handleTitleTouchTap}
          iconElementRight={this.renderIconEleRight(User)}
          iconStyleRight={styles.AppBarIconElementRight}
        />
        <Drawer
          docked={false}
          width={300}
          open={this.state.drawer}
          onRequestChange={(open) => this.setState({ drawer: open })}
        >
          <Subheader style={styles.DrawerHeader}>Vivian Gallery + </Subheader>
          <Divider />
          <Menu disableAutoFocus>
            <MenuItem
              leftIcon={<HomeIcon color={styles.home ? styles.home.color : ''} />}
              primaryText="首页"
              containerElement={<Link to="/" />}
              style={styles.home}
            />
            <MenuItem
              leftIcon={<UserIcon color={styles.user ? styles.user.color : ''} />}
              primaryText="个人资料"
              containerElement={<Link to="/user" />}
              style={styles.user}
            />
            <MenuItem
              leftIcon={<CameraIcon color={styles.collection ? styles.collection.color : ''} />}
              primaryText="收藏集"
              containerElement={<Link to="/collection" />}
              style={styles.collection}
            />
            <MenuItem
              leftIcon={<ExploreIcon color={styles.explore ? styles.explore.color : ''} />}
              primaryText="探索"
              containerElement={<Link to="/explore" />}
              style={styles.explore}
            />
          </Menu>
          <Divider />
          <Menu disableAutoFocus>
            <MenuItem
              leftIcon={<SettingsIcon color={styles.setting ? styles.setting.color : ''} />}
              primaryText="设置"
              containerElement={<Link to="/setting" />}
              style={styles.setting}
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

}

NavHeader.propTypes = {
  location: PropTypes.string.isRequired,
  User: PropTypes.object,
};

// If contextTypes is not defined, then context will be an empty object.
NavHeader.contextTypes = {
  router: PropTypes.object.isRequired,
};
