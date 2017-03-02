import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
import DiaryIcon from 'material-ui/svg-icons/action/book';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ArrowDropdownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { purple500, teal500 } from 'material-ui/styles/colors';
import { Notes } from '/imports/api/notes/note.js';
import { snackBarOpen } from '/imports/ui/redux/actions/index.js';
import scrollTo from '/imports/vendor/scrollTo.js';
import { Wrapper, styles } from '../NavHeader.style.js';
import {
  DrawerProfile,
  DrawerBackground,
  DrawerAvatar,
  DrawerEmail,
} from './Primary.style.js';

class PrimaryNavHeader extends Component {

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
    const logoutPromise = Meteor.wrapPromise(Meteor.logout);
    logoutPromise()
    .then(() => this.props.snackBarOpen('登出成功'))
    .catch(err => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '发生未知错误');
      throw new Meteor.Error(err);
    });
  }

  renderIconRight() {
    const { User, noteNum } = this.props;
    if (Meteor.loggingIn() || User) {
      return (
        <div>
          <IconButton
            style={styles.AppBarIcon}
            iconStyle={styles.AppBarIconSvg}
            onTouchTap={() => browserHistory.push('/search')}
          ><SearchIcon />
          </IconButton>
          <Badge
            badgeContent={noteNum || 0}
            style={{ padding: 0 }}
            badgeStyle={styles.badgeStyle}
            primary
          >
            <IconButton
              className={noteNum > 0 ? 'bell-shake' : ''}
              style={styles.AppBarIcon}
              iconStyle={styles.AppBarIconSvg}
              onTouchTap={() => browserHistory.push(`/note/${User.username}`)}
            ><NotificationIcon />
            </IconButton>
          </Badge>
          <IconButton
            style={styles.AppBarIconBtnForAvatar}
            onTouchTap={() => browserHistory.push(`/user/${User.username}`)}
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
          onTouchTap={() => browserHistory.push('/search')}
        ><SearchIcon />
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
    const { User, location, style, children } = this.props;
    return (
      <Wrapper>
        <AppBar
          style={Object.assign({}, { backgroundColor: purple500 }, style)}
          title="Gallery +"
          titleStyle={styles.AppBarTitle}
          onLeftIconButtonTouchTap={() => this.setState({ drawer: true })}
          onTitleTouchTap={this.handlePrimaryTitleTouchTap}
          iconElementRight={this.renderIconRight()}
          iconStyleRight={styles.AppBarIconElementRight}
        />
        { children }
        <Drawer
          docked={false}
          width={280}
          open={this.state.drawer}
          onRequestChange={(open) => this.setState({ drawer: open })}
        >
          <DrawerProfile style={{ backgroundImage: this.coverSrc }}>
            <DrawerBackground />
            { User && (
              <div>
                <DrawerAvatar>
                  <Avatar
                    size={54}
                    src={User.profile.avatar}
                    onTouchTap={() => browserHistory.push(`/user/${User.username}`)}
                  />
                </DrawerAvatar>
                <DrawerEmail>
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
                </DrawerEmail>
              </div>
            ) }
          </DrawerProfile>
          <Divider />
          <Menu width="100%" disableAutoFocus>
            <MenuItem
              leftIcon={<ExploreIcon color={location === 'explore' ? purple500 : ''} />}
              primaryText="探索"
              onTouchTap={() => browserHistory.push('/')}
              style={{ color: location === 'explore' ? purple500 : '#000' }}
            />
            <MenuItem
              leftIcon={<UserIcon color={location === 'user' ? teal500 : ''} />}
              primaryText="主页"
              onTouchTap={() => browserHistory.push(this.homeLink)}
              style={{ color: location === 'user' ? teal500 : '#000' }}
            />
            <MenuItem
              leftIcon={<CameraIcon />}
              primaryText="相册"
              onTouchTap={() => browserHistory.push(this.collLink)}
            />
            <MenuItem
              leftIcon={<DiaryIcon />}
              primaryText="日记"
              onTouchTap={() => browserHistory.push('/diary')}
            />
          </Menu>
          <Divider />
          <Menu width="100%" disableAutoFocus>
            <MenuItem
              leftIcon={<DeleteIcon />}
              primaryText="回收站"
              onTouchTap={() => browserHistory.push('/recycle')}
            />
          </Menu>
          <Divider />
          <Menu width="100%" disableAutoFocus>
            <MenuItem
              leftIcon={<SettingsIcon />}
              primaryText="设置"
              onTouchTap={() => browserHistory.push('/setting')}
            />
          </Menu>
        </Drawer>
      </Wrapper>
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
  children: PropTypes.any,
  User: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
  location: PropTypes.oneOf(['explore', 'user', 'collection', 'diary', 'recycle', 'setting', 'sign']).isRequired,
  style: PropTypes.object,
  // Pass from Database and Redux
  noteNum: PropTypes.number.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};

const MeteorContainer = createContainer(() => {
  Meteor.subscribe('Notes.receiver');
  return {
    noteNum: Notes.find({ isRead: false }).count(),
  };
}, PrimaryNavHeader);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(MeteorContainer);

