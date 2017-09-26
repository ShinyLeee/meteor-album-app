import moment from 'moment';
import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
// import InfoIcon from 'material-ui/svg-icons/action/info-outline';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import LockOutIcon from 'material-ui/svg-icons/action/lock-open';
import {
  inlineStyles,
  Wrapper,
  Cover,
  Info,
  Avatar,
  CollName,
  UserName,
  Time,
} from './CollHolder.style.js';

const CollHolder = (props) => {
  const {
    clientWidth,
    devicePixelRatio,
    coll,
    avatarSrc,
    showUser,
    showDetails,
    showActions,
    // onCheck,
    onToggleLock,
    onRemove,
  } = props;
  const realDimension = Math.round(clientWidth * devicePixelRatio);
  let fastSrc = `${coll.cover}?imageView2/2/w/${realDimension}`;
  if (coll.cover.indexOf('VF_ac') > 0) fastSrc = coll.cover;
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
            { coll.private && <LockIcon style={inlineStyles.lockIcon} /> }
            <Time dateTime={coll.createdAt}>{moment(coll.createdAt).format('YYYY/M/D')}</Time>
          </div>
        ) }
        { showActions && (
          <IconMenu
            style={inlineStyles.moreVertButton}
            iconButtonElement={<IconButton><MoreVertIcon color="#999" /></IconButton>}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            useLayerForClickAway
          >
            {/* <MenuItem
              leftIcon={<InfoIcon />}
              primaryText="查看信息"
              onTouchTap={() => onCheck(coll)}
            />*/}
            {
              coll.private
              ? (
                <MenuItem
                  leftIcon={<LockOutIcon />}
                  primaryText="公开相册"
                  onTouchTap={() => onToggleLock(coll)}
                />
              )
              : (
                <MenuItem
                  leftIcon={<LockIcon />}
                  primaryText="加密相册"
                  onTouchTap={() => onToggleLock(coll)}
                />
              )
            }

            <MenuItem
              leftIcon={<DeleteIcon />}
              primaryText="删除相册"
              onTouchTap={() => onRemove(coll)}
            />
          </IconMenu>
        ) }
      </Info>
    </Wrapper>
  );
};

CollHolder.displayName = 'CollHolder';

CollHolder.defaultProps = {
  clientWidth: document.body.clientWidth,
  devicePixelRatio: window.devicePixelRatio,
  showUser: false,
  showDetails: false,
  showActions: false,
};

CollHolder.propTypes = {
  clientWidth: PropTypes.number.isRequired,
  devicePixelRatio: PropTypes.number.isRequired,
  coll: PropTypes.object.isRequired,
  avatarSrc: PropTypes.string.isRequired,
  showUser: PropTypes.bool.isRequired,
  showDetails: PropTypes.bool.isRequired,
  showActions: PropTypes.bool.isRequired,
  onCheck: PropTypes.func,
  onToggleLock: PropTypes.func,
  onRemove: PropTypes.func,
};

export default CollHolder;
