import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
import { userLogout, snackBarOpen } from '/imports/ui/redux/actions/index.js';
import scrollTo from '/imports/vendor/scrollTo.js';
import { Wrapper, styles } from '../NavHeader.style.js';
import {
  DrawerProfile,
  DrawerBackground,
  DrawerAvatar,
  DrawerEmail,
} from './Primary.style.js';

const sourceDomain = Meteor.settings.public.sourceDomain;

class PrimaryNavHeader extends Component {
  static propTypes = {
    children: PropTypes.any,
    located: PropTypes.oneOf(['explore', 'user', 'collection', 'diary', 'recycle', 'setting', 'sign']).isRequired,
    style: PropTypes.object,
    // Pass from Database and Redux
    User: PropTypes.object,
    noteNum: PropTypes.number.isRequired,
    userLogout: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    // Pass from React-Router
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {
    located: 'explore',
    noteNum: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      drawer: false,
      actionPop: false,
    };
  }

  get avatarSrc() {
    const { User } = this.props;
    const defaultAvatar = `${sourceDomain}/GalleryPlus/Default/default-avatar.jpg`;
    return User ? User.profile.avatar : defaultAvatar;
  }

  get coverSrc() {
    const { User } = this.props;
    const defaultCover = `url(${sourceDomain}/GalleryPlus/Default/default-cover.jpg)`;
    return User ? `url("${User.profile.cover}")` : defaultCover;
  }

  navigate(location) {
    return this.props.history.push(location);
  }

  _handlePrimaryTitleTouchTap = () => {
    scrollTo(0, 1500);
    this.navigate('/');
  }

  _handleOpenActionPop = (e) => {
    e.preventDefault();
    this.setState({
      actionPop: true,
      anchorEl: e.currentTarget,
    });
  }

  _handleLogout = () => {
    const logoutPromise = Meteor.wrapPromise(Meteor.logout);
    logoutPromise()
    .then(() => {
      this.props.userLogout();
      this.props.snackBarOpen('登出成功');
    })
    .catch(err => {
      console.log(err);
      this.props.snackBarOpen(`登出失败 ${err.reason}`);
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
            onTouchTap={() => this.navigate('/search')}
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
              onTouchTap={() => this.navigate(`/note/${User.username}`)}
            ><NotificationIcon />
            </IconButton>
          </Badge>
          <IconButton
            style={styles.AppBarIconBtnForAvatar}
            onTouchTap={() => this.navigate(`/user/${User.username}`)}
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
          onTouchTap={() => this.navigate('/search')}
        ><SearchIcon />
        </IconButton>
        <FlatButton
          label="登录"
          style={styles.AppBarLoginBtn}
          backgroundColor="rgba(153, 153, 153, 0.2)"
          hoverColor="rgba(153, 153, 153, 0.4)"
          onTouchTap={() => this.navigate('/login')}
        />
      </div>
    );
  }

  render() {
    const { User, located, style, children } = this.props;
    return (
      <Wrapper>
        <AppBar
          style={Object.assign({}, { backgroundColor: purple500 }, style)}
          title="Gallery +"
          titleStyle={styles.AppBarTitle}
          onLeftIconButtonTouchTap={() => this.setState({ drawer: true })}
          onTitleTouchTap={this._handlePrimaryTitleTouchTap}
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
                    onTouchTap={() => this.navigate(`/user/${User.username}`)}
                  />
                </DrawerAvatar>
                <DrawerEmail>
                  <div>
                    <span>{(User.emails && User.emails[0].address) || User.username}</span>
                    <div><ArrowDropdownIcon color="#fff" onTouchTap={this._handleOpenActionPop} /></div>
                    <Popover
                      open={this.state.actionPop}
                      anchorEl={this.state.anchorEl}
                      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                      targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
                      onRequestClose={() => this.setState({ actionPop: false })}
                    >
                      <Menu>
                        <MenuItem primaryText="登出" onTouchTap={this._handleLogout} />
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
              leftIcon={<ExploreIcon color={located === 'explore' ? purple500 : ''} />}
              primaryText="探索"
              onTouchTap={() => this.navigate('/')}
              style={{ color: located === 'explore' ? purple500 : '#000' }}
            />
            <MenuItem
              leftIcon={<UserIcon color={located === 'user' ? teal500 : ''} />}
              primaryText="主页"
              onTouchTap={() => this.navigate(`/user/${this.props.User.username}`)}
              style={{ color: located === 'user' ? teal500 : '#000' }}
            />
            <MenuItem
              leftIcon={<CameraIcon />}
              primaryText="相册"
              onTouchTap={() => this.navigate(`/user/${this.props.User.username}/collection`)}
            />
            <MenuItem
              leftIcon={<DiaryIcon />}
              primaryText="日记"
              onTouchTap={() => this.navigate('/diary')}
            />
          </Menu>
          <Divider />
          <Menu width="100%" disableAutoFocus>
            <MenuItem
              leftIcon={<DeleteIcon />}
              primaryText="回收站"
              onTouchTap={() => this.navigate('/recycle')}
            />
          </Menu>
          <Divider />
          <Menu width="100%" disableAutoFocus>
            <MenuItem
              leftIcon={<SettingsIcon />}
              primaryText="设置"
              onTouchTap={() => this.navigate('/setting')}
            />
          </Menu>
        </Drawer>
      </Wrapper>
    );
  }
}

const MeteorContainer = createContainer(() => {
  Meteor.subscribe('Notes.receiver');
  return {
    noteNum: Notes.find({ isRead: false }).count(),
  };
}, PrimaryNavHeader);

const mapStateToProps = (state) => ({
  User: state.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogout,
  snackBarOpen,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MeteorContainer));

