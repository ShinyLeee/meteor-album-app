import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import InfoIcon from 'material-ui-icons/Info';
import TimelineIcon from 'material-ui-icons/Timeline';
import { Users } from '/imports/api/users/user';
import {
  Inner,
  ZoomerImage,
  ZoomerBackground,
  ToolBoxSection,
  ActionSection,
  UserAvatar,
  ImageDetail,
} from '../ZoomerHolder.style';

const ZoomerInner = (props) => {
  const {
    image,
    imageHolderStyle,
    classes,
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
          className={classes.iconBtn}
          onClick={onLogoClick}
        ><CloseIcon className={classes.icon__logo} />
        </IconButton>
      </ToolBoxSection>
      <ActionSection>
        <div>
          <UserAvatar
            src={avatar}
            role="presentation"
            onClick={onAvatarClick}
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
            className={classes.iconBtn}
            onClick={onInfoActionClick}
          ><TimelineIcon />
          </IconButton>
          <IconButton
            className={classes.iconBtn}
            onClick={onExifActionClick}
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
  classes: PropTypes.object.isRequired,
  onLogoClick: PropTypes.func.isRequired,
  onAvatarClick: PropTypes.func.isRequired,
  onInfoActionClick: PropTypes.func.isRequired,
  onExifActionClick: PropTypes.func.isRequired,
};

const styles = {
  iconBtn: {
    color: '#fff',
  },

  icon__logo: {
    width: 28,
    height: 28,
  },
};

export default withStyles(styles)(ZoomerInner);
