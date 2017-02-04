import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import SearchIcon from 'material-ui/svg-icons/action/search';
import NotificationIcon from 'material-ui/svg-icons/social/notifications';
import UserIcon from 'material-ui/svg-icons/action/account-circle';
import ExploreIcon from 'material-ui/svg-icons/action/explore';
import CameraIcon from 'material-ui/svg-icons/image/camera';
import MemeoryIcon from 'material-ui/svg-icons/action/theaters';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ArrowDropdownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { purple500 } from 'material-ui/styles/colors';

import scrollTo from '/imports/utils/scrollTo.js';
import styles from '../../NavHeader.style.js';

export default class PrimaryNavHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawer: false,
      actionPop: false,
    };
    this.handlePrimaryTitleTouchTap = this.handlePrimaryTitleTouchTap.bind(this);
    this.handleOpenActionPop = this.handleOpenActionPop.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  get avatarSrc() {
    const defaultAvatar = `${this.props.sourceDomain}/GalleryPlus/Default/default-avatar.jpg`;
    return this.props.User ? this.props.User.profile.avatar : defaultAvatar;
  }

  get coverSrc() {
    const defaultCover = `url(${this.props.sourceDomain}/GalleryPlus/Default/default-cover.jpg)`;
    return this.props.User ? `url("${this.props.User.profile.cover}")` : defaultCover;
  }

  get homeLink() {
    return this.props.User ? `/user/${this.props.User.username}` : '/login';
  }

  get collLink() {
    return this.props.User ? `/user/${this.props.User.username}/collection` : '/login';
  }

  handlePrimaryTitleTouchTap() {
    scrollTo(0, 1500);
    browserHistory.push('/');
  }

  handleOpenActionPop(e) {
    e.preventDefault();
    this.setState({
      actionPop: true,
      anchorEl: e.currentTarget,
    });
  }

  handleLogout() {
    Meteor.logout((err) => {
      if (err) {
        this.props.snackBarOpen('发生未知错误');
        throw new Meteor.Error(err);
      }
      this.props.snackBarOpen('登出成功');
    });
  }

  renderIconRight() {
    const bellStyle = this.props.noteNum > 0 ? 'bell-shake' : '';
    if (Meteor.loggingIn() || this.props.User) {
      return (
        <div>
          <IconButton
            style={styles.AppBarIcon}
            iconStyle={styles.AppBarIconSvg}
            onTouchTap={() => browserHistory.push('/search')}
          ><SearchIcon />
          </IconButton>
          <Badge
            badgeContent={this.props.noteNum || 0}
            style={{ padding: 0 }}
            badgeStyle={{ width: '20px', height: '20px', top: '4px' }}
            primary
          >
            <IconButton
              className={bellStyle}
              style={styles.AppBarIcon}
              iconStyle={styles.AppBarIconSvg}
              onTouchTap={() => browserHistory.push(`/note/${this.props.User.username}`)}
            ><NotificationIcon />
            </IconButton>
          </Badge>
          <IconButton
            style={styles.AppBarIconBtnForAvatar}
            onTouchTap={() => browserHistory.push(`/user/${this.props.User.username}`)}
          ><Avatar src={this.avatarSrc} />
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
          onTouchTap={() => browserHistory.push('/login')}
        />
      </div>
    );
  }

  render() {
    const { User, location } = this.props;
    return (
      <div className="component__NavHeader">
        <AppBar
          className="component__Drawer"
          style={styles.AppBar}
          title="Gallery +"
          titleStyle={styles.AppBarTitle}
          onLeftIconButtonTouchTap={() => this.setState({ drawer: true })}
          onTitleTouchTap={this.handlePrimaryTitleTouchTap}
          iconElementRight={this.renderIconRight()}
          iconStyleRight={styles.AppBarIconElementRight}
        />
        <Drawer
          docked={false}
          width={280}
          open={this.state.drawer}
          onRequestChange={(open) => this.setState({ drawer: open })}
        >
          <div
            className="Drawer__profile"
            style={{ backgroundImage: this.coverSrc }}
          >
            <div className="Drawer__background" />
            { User && (
              <div>
                <div className="Drawer__avatar">
                  <Avatar
                    size={54}
                    src={User.profile.avatar}
                    onTouchTap={() => browserHistory.push(`/user/${User.username}`)}
                  />
                </div>
                <div className="Drawer__email">
                  <div>
                    <span>{(User.emails && User.emails[0].address) || User.username}</span>
                    <div><ArrowDropdownIcon color="#fff" onTouchTap={this.handleOpenActionPop} /></div>
                    <Popover
                      open={this.state.actionPop}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                      targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
                      onRequestClose={() => this.setState({ actionPop: false })}
                    >
                      <Menu>
                        <MenuItem primaryText="登出" onTouchTap={this.handleLogout} />
                      </Menu>
                    </Popover>
                  </div>
                </div>
              </div>
            ) }
          </div>
          <Divider />
          <Menu width="100%" disableAutoFocus>
            <MenuItem
              leftIcon={<ExploreIcon color={location === 'explore' ? purple500 : ''} />}
              primaryText="探索"
              onTouchTap={() => browserHistory.push('/')}
              style={{ color: location === 'explore' ? purple500 : '#000' }}
            />
            <MenuItem
              leftIcon={<UserIcon color={location === 'user' ? purple500 : ''} />}
              primaryText="我的主页"
              onTouchTap={() => browserHistory.push(this.homeLink)}
              style={{ color: location === 'user' ? purple500 : '#000' }}
            />
            <MenuItem
              leftIcon={<CameraIcon color={location === 'collection' ? purple500 : ''} />}
              primaryText="相册"
              onTouchTap={() => browserHistory.push(this.collLink)}
              style={{ color: location === 'collection' ? purple500 : '#000' }}
            />
            <MenuItem
              leftIcon={<MemeoryIcon color={location === 'memory' ? purple500 : ''} />}
              primaryText="回忆"
              onTouchTap={() => browserHistory.push('/memory')}
              style={{ color: location === 'memory' ? purple500 : '#000' }}
            />
          </Menu>
          <Divider />
          <Menu width="100%" disableAutoFocus>
            <MenuItem
              leftIcon={<DeleteIcon color={location === 'recycle' ? purple500 : ''} />}
              primaryText="回收站"
              onTouchTap={() => browserHistory.push('/recycle')}
              style={{ color: location === 'recycle' ? purple500 : '#000' }}
            />
          </Menu>
          <Divider />
          <Menu width="100%" disableAutoFocus>
            <MenuItem
              leftIcon={<SettingsIcon color={location === 'setting' ? purple500 : ''} />}
              primaryText="设置"
              onTouchTap={() => browserHistory.push('/setting')}
              style={{ color: location === 'setting' ? purple500 : '#000' }}
            />
          </Menu>
        </Drawer>
      </div>
    );
  }
}

PrimaryNavHeader.displayName = 'PrimaryNavHeader';

PrimaryNavHeader.defaultProps = {
  sourceDomain: Meteor.settings.public.sourceDomain,
  location: 'explore',
  noteNum: 0,
};

PrimaryNavHeader.propTypes = {
  User: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  // Pass from Database
  noteNum: PropTypes.number.isRequired,
  // Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
