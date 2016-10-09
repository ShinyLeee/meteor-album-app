import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import HelpIcon from 'material-ui/svg-icons/action/help-outline';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';

import { Link } from 'react-router';

import displayAlert from '../lib/displayAlert.js';
import defaultUser from '../lib/defaultUser.js';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'User',
    };
    this._handleLogout = this._handleLogout.bind(this);
  }

  _handleLogout() {
    Meteor.logout((err) => {
      if (err) {
        displayAlert('error', 'user.logout.unexpectedError');
        return console.error(err); // TODO LOG
      }
      this.context.router.replace('/login');
      displayAlert('success', 'user.logout.success');
      return true;
    });
  }

  render() {
    return (
      <div className="content">
        <div className="user-holder">
          <div className="user-panel">
            <div className="user-header">
              <div className="user-avatar">
                <img src={this.props.User.profile.avatar} alt="user-avatar" />
                <div className="user-action">
                  <IconMenu
                    iconButtonElement={<IconButton><MoreHorizIcon color="#999" /></IconButton>}
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem
                      primaryText="账号设置"
                      containerElement={<Link to={'/user/settings'} />}
                      leftIcon={<SettingsIcon />}
                    />
                    <MenuItem
                      primaryText="帮助"
                      containerElement={<Link to={'/help'} />}
                      leftIcon={<HelpIcon />}
                    />
                    <MenuItem
                      primaryText="登出"
                      leftIcon={<ExitToAppIcon />}
                      onTouchTap={this._handleLogout}
                    />
                  </IconMenu>
                </div>
              </div>
              <div className="user-name">
                <h1>{this.props.User.username}</h1>
              </div>
            </div>
          </div>
          <div className="user-info">
            <Link className="user-like highlight" to="/user/liked">
              <span>{this.props.User.profile.likes}</span>
              <span>Liked</span>
            </Link>
            <Link className="user-note" to="/user/notes">
              <span>{this.props.User.profile.notes}</span>
              <span>Notes</span>
            </Link>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }

}

User.propTypes = {
  User: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

// If contextTypes is not defined, then context will be an empty object.
User.contextTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  User: state.user || defaultUser,
});

export default connect(mapStateToProps)(User);
