import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import CameraIcon from 'material-ui/svg-icons/image/camera-alt';
// import HeartIcon from 'material-ui/svg-icons/action/favorite';
// import AddIcon from 'material-ui/svg-icons/content/add';
import InfoIcon from 'material-ui/svg-icons/action/info';
// import TimelineIcon from 'material-ui/svg-icons/action/timeline';
import { Users } from '/imports/api/users/user.js';

const ZoomerInner = ({ image, imageHolderStyle, onLogoClick, onExifActionClick }) => {
  const user = Users.findOne({ username: image.user });
  const avatar = user && user.profile.avatar;
  return (
    <div className="ZoomerHolder__inner">
      <div className="ZoomerHolder__image" style={imageHolderStyle}>
        <div className="ZoomerHolder__background" />
      </div>
      <div className="ZoomerHolder__toolbox">
        <IconButton
          className="ZoomerHolder__logo"
          iconStyle={{ width: '32px', height: '32px', color: '#fff' }}
          onTouchTap={onLogoClick}
        ><CameraIcon />
        </IconButton>
        {/* <div className="ZoomerHolder__action_top">
          <IconButton
            iconStyle={{ color: '#fff' }}
            onTouchTap={this.handleOpenPrompt}
          ><HeartIcon />
          </IconButton>
          <IconButton
            iconStyle={{ color: '#fff' }}
            onTouchTap={this.handleOpenPrompt}
          ><AddIcon />
          </IconButton>
        </div>*/}
      </div>
      <div className="ZoomerHolder__info">
        <div className="ZoomerHolder__profile">
          <img
            src={avatar}
            role="presentation"
            onTouchTap={() => browserHistory.push(`/user/${image.user}`)}
          />
          <div className="ZoomerHolder__detail">
            <span className="ZoomerHolder__title">
              {image.user}
            </span>
            <span className="ZoomerHolder__subtitle">
              {moment(image.createdAt).format('YYYY-MM-DD HH:mm')}
            </span>
          </div>
        </div>
        <div className="ZoomerHolder__action_bottom">
          {/* <IconButton
            className="ZoomerHolder__imgStatus"
            iconStyle={{ color: '#fff' }}
            onTouchTap={onInfoActionClick}
          ><TimelineIcon />
          </IconButton>*/}
          <IconButton
            className="ZoomerHolder__imgExif"
            iconStyle={{ color: '#fff' }}
            onTouchTap={onExifActionClick}
          ><InfoIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

ZoomerInner.displayName = 'ZoomerInner';

ZoomerInner.propTypes = {
  image: PropTypes.object.isRequired,
  imageHolderStyle: PropTypes.object.isRequired,
  onLogoClick: PropTypes.func.isRequired,
  onExifActionClick: PropTypes.func.isRequired,
};

export default ZoomerInner;
