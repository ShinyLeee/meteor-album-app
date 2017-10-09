import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { Component } from 'react';
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
import purple from 'material-ui/colors/purple';
import teal from 'material-ui/colors/teal';
import settings from '/imports/utils/settings';
import { userLogout, snackBarOpen } from '/imports/ui/redux/actions';
import {
  DrawerContent,
  DrawerProfile,
  DrawerBackground,
  DrawerAvatar,
  DrawerEmail,
} from '../Primary.style.js';

const noop = () => {};

const { sourceDomain } = settings;

class NavHeaderDrawer extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    User: PropTypes.object,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    userLogout: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    popover: false,
    popoverAnchor: undefined,
    drawer: false,
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

  _navTo = (to) => () => {
    this.props.history.push(to);
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

  _handleOpenPop = (e) => {
    this.setState({
      popover: true,
      popoverAnchor: e.currentTarget,
    });
  }

  render() {
    const { User, visible, match, classes, onRequestClose } = this.props;
    const indexPage = match.path === '/';
    const userPage = !!match.params.username;
    return (
      <Drawer
        open={visible}
        onRequestClose={onRequestClose}
      >
        <DrawerContent>
          <DrawerProfile style={{ backgroundImage: this.coverSrc }}>
            <DrawerBackground />
            <DrawerAvatar>
              <Avatar
                className={classes.avatar}
                src={this.avatarSrc}
                onClick={User ? this._navTo(`/user/${User.username}`) : noop}
              />
            </DrawerAvatar>
            {
              User && (
                <DrawerEmail>
                  <div>
                    <span>{(User.emails && User.emails[0].address) || User.username}</span>
                    <div><ArrowDropdownIcon color="#fff" onClick={this._handleOpenPop} /></div>
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
                  </div>
                </DrawerEmail>
              )
            }
          </DrawerProfile>
          <Divider />
          <List>
            <ListItem
              onClick={this._navTo('/')}
              button
            >
              <ListItemIcon className={classNames({ [classes.purple]: indexPage })}>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText
                classes={indexPage ? { text: classes.purple } : {}}
                primary="探索"
              />
            </ListItem>
            <ListItem
              onClick={User ? this._navTo(`/user/${User.username}`) : this._navTo('/login')}
              button
            >
              <ListItemIcon className={classNames({ [classes.teal]: userPage })}>
                <UserIcon />
              </ListItemIcon>
              <ListItemText
                classes={userPage ? { text: classes.teal } : {}}
                primary="主页"
              />
            </ListItem>
            <ListItem
              onClick={User ? this._navTo(`/user/${User.username}/collection`) : this._navTo('/login')}
              button
            >
              <ListItemIcon>
                <CameraIcon />
              </ListItemIcon>
              <ListItemText primary="相册" />
            </ListItem>
            <ListItem
              onClick={this._navTo('/diary')}
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
              onClick={this._navTo('/recycle')}
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
        </DrawerContent>
      </Drawer>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogout,
  snackBarOpen,
}, dispatch);

const styles = {
  avatar: {
    width: 54,
    height: 54,
  },

  purple: {
    color: purple[500],
  },

  teal: {
    color: teal[500],
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withRouter,
)(NavHeaderDrawer);
