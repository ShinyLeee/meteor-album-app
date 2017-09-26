import React, { PropTypes } from 'react';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import InfoIcon from 'material-ui/svg-icons/action/info';
import TimelineIcon from 'material-ui/svg-icons/action/timeline';
import { Users } from '/imports/api/users/user.js';
import {
  Inner,
  ZoomerImage,
  ZoomerBackground,
  ToolBoxSection,
  ActionSection,
  UserAvatar,
  ImageDetail,
} from '../../ZoomerHolder.style.js';

const ZoomerInner = (props) => {
  const {
    image,
    imageHolderStyle,
    onLogoClick,
    onAvatarClick,
    onInfoActionClick,
    onExifActionClick,
  } = props;
  const user = Users.findOne({ username: image.user });
  const avatar = user && user.profile.avatar;
  return (
    <Inner>
      <ZoomerImage style={imageHolderStyle}>
        <ZoomerBackground />
      </ZoomerImage>
      <ToolBoxSection>
        <IconButton
          iconStyle={{ width: '32px', height: '32px', color: '#fff' }}
          onTouchTap={onLogoClick}
        ><CloseIcon />
        </IconButton>
      </ToolBoxSection>
      <ActionSection>
        <div>
          <UserAvatar
            src={avatar}
            role="presentation"
            onTouchTap={onAvatarClick}
          />
          <ImageDetail>
            <span>
              {image.user}
            </span>
            <span>
              {moment(image.createdAt).format('YYYY-MM-DD HH:mm')}
            </span>
          </ImageDetail>
        </div>
        <div>
          <IconButton
            iconStyle={{ color: '#fff' }}
            onTouchTap={onInfoActionClick}
          ><TimelineIcon />
          </IconButton>
          <IconButton
            iconStyle={{ color: '#fff' }}
            onTouchTap={onExifActionClick}
          ><InfoIcon />
          </IconButton>
        </div>
      </ActionSection>
    </Inner>
  );
};

ZoomerInner.propTypes = {
  image: PropTypes.object.isRequired,
  imageHolderStyle: PropTypes.object.isRequired,
  onLogoClick: PropTypes.func.isRequired,
  onAvatarClick: PropTypes.func.isRequired,
  onInfoActionClick: PropTypes.func.isRequired,
  onExifActionClick: PropTypes.func.isRequired,
};

export default ZoomerInner;
