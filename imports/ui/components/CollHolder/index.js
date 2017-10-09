import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
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
  Avatar,
  CollName,
  UserName,
  Time,
} from './CollHolder.style.js';

class CollHolder extends Component {
  static propTypes = {
    coll: PropTypes.object.isRequired,
    avatarSrc: PropTypes.string.isRequired,
    showUser: PropTypes.bool.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showActions: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    onCheck: PropTypes.func,
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

  render() {
    const {
      coll,
      avatarSrc,
      showUser,
      showDetails,
      showActions,
      classes,
    } = this.props;
    let fastSrc = `${coll.cover}?imageView2/2/w/${rWidth}`;
    if (coll.cover.indexOf('VF_ac') > 0) {
      fastSrc = coll.cover;
    }
    return (
      <Wrapper>
        <Cover>
          <Link to={`/user/${coll.user}/collection/${coll.name}`}>
            <img
              src={fastSrc}
              role="presentation"
            />
          </Link>
        </Cover>
        <Info>
          <Avatar>
            <img
              src={avatarSrc}
              role="presentation"
            />
          </Avatar>
          <CollName>{coll.name}</CollName>
          { showUser && <UserName>{coll.user}</UserName> }
          { showDetails && (
            <div>
              { coll.private && <LockIcon className={classes.lockIcon} /> }
              <Time dateTime={coll.createdAt}>{moment(coll.createdAt).format('YYYY/M/D')}</Time>
            </div>
          ) }
          {
            showActions && (
              <div>
                <IconButton
                  className={classes.moreVertBtn}
                  onClick={(e) => this.setState({ menuOpen: true, anchorEl: e.currentTarget })}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  open={this.state.menuOpen}
                  anchorEl={this.state.anchorEl}
                  onRequestClose={this._handleRequestClose}
                >
                  {/* <MenuItem
                    leftIcon={<InfoIcon />}
                    primaryText="查看信息"
                    onClick={() => onCheck(coll)}
                  />*/}
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
                </Menu>
              </div>
            )
          }
        </Info>
      </Wrapper>
    );
  }
}

const styles = {
  lockIcon: {
    width: 17,
    height: 17,
    marginRight: 5,
    color: '#999',
    verticalAlign: 'middle',
  },

  moreVertBtn: {
    position: 'absolute',
    top: 12,
    right: 0,
  },

  menuItem: {
    paddingRight: 28,
  },

  menuBtn: {
    color: '#999',
  },
};

export default withStyles(styles)(CollHolder);
