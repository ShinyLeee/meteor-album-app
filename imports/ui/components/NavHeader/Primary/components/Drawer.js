import get from 'lodash/get';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Popover from 'material-ui/Popover';
import UserIcon from 'material-ui-icons/AccountCircle';
import ExploreIcon from 'material-ui-icons/Explore';
import CameraIcon from 'material-ui-icons/Camera';
import DiaryIcon from 'material-ui-icons/Book';
import DeleteIcon from 'material-ui-icons/Delete';
import SettingsIcon from 'material-ui-icons/Settings';
import ArrowDropdownIcon from 'material-ui-icons/ArrowDropDown';
import Modal from '/imports/ui/components/Modal';
import { ResponsiveCover } from '/imports/ui/components/ProgressiveImage';
import settings from '/imports/utils/settings';
import { userLogout, snackBarOpen } from '/imports/ui/redux/actions';
import {
  DrawerProfile,
  DrawerControlCenter,
  DrawerAvatar,
  DrawerEmail,
} from './Drawer.style';

const noop = () => {};

const { sourceDomain } = settings;

class NavHeaderDrawer extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    User: PropTypes.object,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    userLogout: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    popover: false,
    popoverAnchor: undefined,
  }

  get avatarSrc() {
    const { User } = this.props;
    const defaultAvatar = `${sourceDomain}/GalleryPlus/Default/default-avatar.jpg`;
    return get(User, 'profile.avatar') || defaultAvatar;
  }

  get coverSrc() {
    const { User } = this.props;
    const defaultCover = `${sourceDomain}/GalleryPlus/Default/default-cover.jpg`;
    return get(User, 'profile.cover') || defaultCover;
  }

  _navTo = (to) => () => {
    const { location: { pathname } } = this.props;
    if (pathname === to) {
      this.props.onRequestClose();
    }
    if (to === '/login') {
      this.props.snackBarOpen('您还尚未登录');
    }
    this.props.history.push(to);
  }

  _handleLogout = async () => {
    this.props.onRequestClose();
    await Modal.showLoader('登出中');
    await this.props.userLogout();
    Modal.close();
  }

  renderPopover = (e) => {
    this.setState({
      popover: true,
      popoverAnchor: e.currentTarget,
    });
  }

  render() {
    const {
      visible,
      isLoggedIn,
      User,
      match,
      classes,
      onRequestClose,
    } = this.props;
    const isIndexPage = match.path === '/';
    const isUserPage = !!match.params.username;
    return (
      <Drawer
        open={visible}
        classes={{ paper: classes.drawer }}
        onRequestClose={onRequestClose}
      >
        <DrawerProfile>
          <ResponsiveCover
            src={this.coverSrc}
            basis={0.35}
            maxHeight={250}
          />
          <DrawerControlCenter>
            <DrawerAvatar>
              <Avatar
                className={classes.avatar}
                src={this.avatarSrc}
                onClick={isLoggedIn ? this._navTo(`/user/${User.username}`) : noop}
              />
            </DrawerAvatar>
            {
              isLoggedIn && (
                <DrawerEmail>
                  <span>{get(User, 'emails[0].address') || User.username}</span>
                  <ArrowDropdownIcon color="#fff" onClick={this.renderPopover} />
                  <Popover
                    open={this.state.popover}
                    anchorEl={this.state.popoverAnchor}
                    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                    transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                    onRequestClose={() => this.setState({ popover: false })}
                  >
                    <List>
                      <ListItem onClick={this._handleLogout}>
                        <ListItemText primary="登出" />
                      </ListItem>
                    </List>
                  </Popover>
                </DrawerEmail>
              )
            }
          </DrawerControlCenter>
        </DrawerProfile>
        <Divider />
        <div>
          <List>
            <ListItem
              onClick={this._navTo('/')}
              button
            >
              <ListItemIcon className={classNames({ [classes.purple]: isIndexPage })}>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText
                classes={isIndexPage ? { text: classes.purple } : {}}
                primary="探索"
              />
            </ListItem>
            <ListItem
              onClick={isLoggedIn ? this._navTo(`/user/${User.username}`) : this._navTo('/login')}
              button
            >
              <ListItemIcon className={classNames({ [classes.red]: isUserPage })}>
                <UserIcon />
              </ListItemIcon>
              <ListItemText
                classes={isUserPage ? { text: classes.red } : {}}
                primary="主页"
              />
            </ListItem>
            <ListItem
              onClick={isLoggedIn ? this._navTo(`/user/${User.username}/collection`) : this._navTo('/login')}
              button
            >
              <ListItemIcon>
                <CameraIcon />
              </ListItemIcon>
              <ListItemText primary="相册" />
            </ListItem>
            <ListItem
              onClick={isLoggedIn ? this._navTo('/diary') : this._navTo('/login')}
              button
            >
              <ListItemIcon>
                <DiaryIcon />
              </ListItemIcon>
              <ListItemText primary="日记" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              onClick={isLoggedIn ? this._navTo('/recycle') : this._navTo('/login')}
              button
            >
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="回收站" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              onClick={this._navTo('/setting')}
              button
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="设置" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  isLoggedIn: sessions.isLoggedIn,
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogout,
  snackBarOpen,
}, dispatch);

const styles = {
  drawer: {
    width: '70%',
  },

  avatar: {
    width: 54,
    height: 54,
  },

  purple: {
    color: '#764ba2',
  },

  red: {
    color: 'rgb(196, 58, 48)',
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withRouter,
)(NavHeaderDrawer);
