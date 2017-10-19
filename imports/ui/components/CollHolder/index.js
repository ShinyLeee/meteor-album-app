import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
    avatarSrc: PropTypes.string.isRequired,
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

  render() {
    const {
      coll,
      avatarSrc,
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
          <Avatar classes={{ root: classes.avatar }} src={avatarSrc} alt="" />
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
                ><MoreVertIcon />
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
  avatar: {
    position: 'absolute',
    top: -18,
    width: 26,
    height: 26,
  },

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
