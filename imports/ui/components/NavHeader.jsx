import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
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
import { snackBarOpen } from '../actions/actionTypes.js';

const styles = {
  AppBar: {
    position: 'fixed',
    top: 0,
    backgroundColor: purple500,
  },
  AppBarTitle: {
    fontSize: '20px',
    fontFamily: 'Microsoft Yahei',
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
    top: '4px',
  },
  AppBarIconSvg: {
    width: '28px',
    height: '28px',
    color: '#fff',
  },
  AppBarIconBtnForAvatar: {
    left: '10px',
    top: '8px',
    padding: 0,
  },
  AppBarIconBtnForLogin: {
    top: '8px',
    marginRight: '12px',
  },
  AppBarLoginBtn: {
    margin: '12px 0 0 0',
    color: '#fff',
  },
  indeterminateProgress: {
    position: 'fixed',
    top: '64px',
    backgroundColor: 'none',
  },
};

class NavHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      drawer: false,
      userAction: false,
    };
    this.handlePrimaryTitleTouchTap = this.handlePrimaryTitleTouchTap.bind(this);
    this.handleOpenUserAction = this.handleOpenUserAction.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handlePrompt = this.handlePrompt.bind(this);
  }

  get avatarSrc() {
    const defaultAvatar = '/img/default-avatar.jpg';
    return this.props.User ? this.props.User.profile.avatar : defaultAvatar;
  }

  get coverSrc() {
    const defaultCover = 'url(/img/default-cover.jpg)';
    return this.props.User ? `url(${this.props.User.profile.cover})` : defaultCover;
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

  handleOpenUserAction(e) {
    e.preventDefault();
    const anchorEl = e.target;
    this.setState({ userAction: true, anchorEl });
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

  handlePrompt() {
    const { dispatch } = this.props;
    dispatch(snackBarOpen('功能开发中'));
  }

  renderPrimaryIconRight(User) {
    const { noteNum } = this.props;
    const bellStyle = noteNum > 0 ? 'bell-shake' : '';
    if (Meteor.loggingIn() || User) {
      return (
        <div>
          <IconButton
            style={styles.AppBarIcon}
            iconStyle={styles.AppBarIconSvg}
            onTouchTap={this.handlePrompt}
          >
            <SearchIcon />
          </IconButton>
          <Badge
            badgeContent={noteNum || 0}
            style={{ padding: 0 }}
            badgeStyle={{ width: '20px', height: '20px', top: '4px' }}
            primary
          >
            <IconButton
              className={bellStyle}
              style={styles.AppBarIcon}
              iconStyle={styles.AppBarIconSvg}
              onTouchTap={() => browserHistory.push('/note')}
            >
              <NotificationIcon />
            </IconButton>
          </Badge>
          <IconButton
            style={styles.AppBarIconBtnForAvatar}
            onTouchTap={() => browserHistory.push(`/user/${User.username}`)}
          >
            <Avatar src={this.avatarSrc} />
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
          <div
            className="drawer-profile"
            style={{ backgroundImage: this.coverSrc }}
          >
            <div className="drawer-profile-background" />
            { User && (
              <div>
                <div className="drawer-profile-avatar">
                  <Avatar
                    size={54}
                    src={User.profile.avatar}
                    onTouchTap={() => browserHistory.push(`/user${User.username}`)}
                  />
                </div>
                <div className="drawer-profile-email">
                  <div>
                    <span>{User.emails[0].address}</span>
                    <div><ArrowDropdownIcon color="#fff" onTouchTap={this.handleOpenUserAction} /></div>
                    <Popover
                      open={this.state.userAction}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                      targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
                      onRequestClose={() => { this.setState({ userAction: false }); }}
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

  render() {
    const {
      loading,
      primary,
      title,
      style,
      showMenuIconButton,
      onTitleTouchTap,
      iconElementLeft,
      iconElementRight,
      onLeftIconButtonTouchTap,
    } = this.props;

    if (loading) {
      return (
        <div className="NavHeader-container">
          <AppBar
            style={styles.AppBar}
            titleStyle={styles.AppBarTitle}
            title="登录中..."
          />
        </div>
      );
    }
    if (primary) {
      return this.renderPrimaryNavHeader();
    }
    return (
      <div className="NavHeader-container">
        <AppBar
          style={Object.assign({}, styles.AppBar, style)}
          titleStyle={styles.AppBarTitle}
          title={title}
          showMenuIconButton={showMenuIconButton}
          onTitleTouchTap={onTitleTouchTap}
          iconElementLeft={iconElementLeft}
          iconElementRight={iconElementRight}
          onLeftIconButtonTouchTap={onLeftIconButtonTouchTap}
        />
      </div>
    );
  }

}

NavHeader.propTypes = {
  User: PropTypes.object,
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
   * noteNum:
   *
   * for notification badge
   */
  noteNum: PropTypes.number,
  /**
   * Below:
   *
   * The below props are all pass to AppBar Component,
   * when primary is false.
   * see: http://www.material-ui.com/#/components/app-bar
   */
  title: PropTypes.string,
  style: PropTypes.object,
  showMenuIconButton: PropTypes.bool,
  onTitleTouchTap: PropTypes.func,
  iconElementLeft: PropTypes.element,
  iconElementRight: PropTypes.element,
  onLeftIconButtonTouchTap: PropTypes.func,
  dispatch: PropTypes.func,
};

export default connect()(NavHeader);
