import get from 'lodash/get';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import DeleteIcon from 'material-ui-icons/Delete';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import LockIcon from 'material-ui-icons/LockOutline';
import LockOutIcon from 'material-ui-icons/LockOpen';
import { rWidth } from '/imports/utils/responsive';
import {
  Wrapper,
  Cover,
  Info,
  CollName,
  UserName,
  Time,
} from './CollHolder.style';

class CollHolder extends Component {
  static propTypes = {
    coll: PropTypes.object.isRequired,
    owner: PropTypes.object.isRequired,
    showUser: PropTypes.bool,
    showDetails: PropTypes.bool,
    showActions: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onToggleLock: PropTypes.func,
    onRemove: PropTypes.func,
  }

  static defaultProps = {
    showUser: false,
    showDetails: false,
    showActions: false,
  }

  state = {
    menuOpen: false,
    anchorEl: undefined,
  }

  _handleRequestClose = () => {
    this.setState({ menuOpen: false });
  }

  _handleToggleLock = () => {
    const { coll } = this.props;
    this._handleRequestClose();
    this.props.onToggleLock(coll);
  }

  _handleToggleRemove = () => {
    const { coll } = this.props;
    this._handleRequestClose();
    this.props.onRemove(coll);
  }

  renderPopover = (e) => {
    this.setState({ menuOpen: true, anchorEl: e.currentTarget });
  }

  render() {
    const {
      coll,
      owner,
      showUser,
      showDetails,
      showActions,
      classes,
    } = this.props;
    const fastSrc = coll.cover.indexOf('VF_ac') > 0
      ? coll.cover
      : `${coll.cover}?imageView2/2/w/${rWidth}`;
    return (
      <Wrapper>
        <Cover>
          <Link to={`/user/${coll.user}/collection/${coll.name}`}>
            <img src={fastSrc} alt="" />
          </Link>
        </Cover>
        <Info>
          <Avatar classes={{ root: classes.avatar }} src={get(owner, 'profile.avatar')} alt="" />
          <CollName>{coll.name}</CollName>
          { showUser && <UserName>{coll.user}</UserName> }
          { showDetails && (
            <div>
              { coll.private && <LockIcon className={classes.lockIcon} /> }
              <Time dateTime={coll.createdAt}>{moment(coll.createdAt).format('YYYY/M/D')}</Time>
            </div>
          ) }
          {
            showActions && [
              <IconButton
                key="actionBtn"
                className={classes.moreVertBtn}
                onClick={this.renderPopover}
              ><MoreVertIcon />
              </IconButton>,
              <Menu
                key="actionMenu"
                open={this.state.menuOpen}
                anchorEl={this.state.anchorEl}
                onRequestClose={this._handleRequestClose}
              >
                {/* <MenuItem
                leftIcon={<InfoIcon />}
                primaryText="查看信息"
                onClick={() => onCheck(coll)}
              /> */}
                <MenuItem className={classes.menuItem} onClick={this._handleToggleLock}>
                  <IconButton className={classes.menuBtn}>
                    { coll.private ? <LockOutIcon /> : <LockIcon />}
                  </IconButton>
                  { coll.private ? '公开相册' : ' 加密相册' }
                </MenuItem>
                <MenuItem className={classes.menuItem} onClick={this._handleToggleRemove}>
                  <IconButton className={classes.menuBtn}>
                    <DeleteIcon />
                  </IconButton>
                  删除相册
                </MenuItem>
              </Menu>,
            ]
          }
        </Info>
      </Wrapper>
    );
  }
}

const styles = {
  avatar: {
    width: 26,
    height: 26,
    marginTop: -26,
  },

  lockIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
    color: '#999',
    verticalAlign: 'middle',
  },

  moreVertBtn: {
    position: 'absolute',
    right: 0,
    color: '#666',
  },

  menuItem: {
    paddingRight: 28,
  },

  menuBtn: {
    color: '#999',
  },
};

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const trackHandler = ({ User, coll }) => {
  let owner;
  if (User && User.username === coll.user) {
    owner = User;
  } else {
    Meteor.subscribe('Users.all');
    owner = Meteor.users.findOne({ username: coll.user });
  }
  return {
    owner,
  };
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
  withTracker(trackHandler),
)(CollHolder);
