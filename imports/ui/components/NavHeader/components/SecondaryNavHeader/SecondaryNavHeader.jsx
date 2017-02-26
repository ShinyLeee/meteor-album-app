import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import scrollTo from '/imports/vendor/scrollTo.js';
import styles from '../../NavHeader.style.js';

const SecondaryNavHeader = ({ title, titleStyle, iconElementRight, style, iconColor }) => (
  <AppBar
    style={Object.assign({}, styles.AppBar, style)}
    title={title}
    titleStyle={Object.assign({}, styles.AppBarTitle, titleStyle)}
    onTitleTouchTap={() => scrollTo(0, 1500)}
    iconElementLeft={
      <IconButton onTouchTap={() => browserHistory.goBack()}>
        <ArrowBackIcon color={iconColor || '#fff'} />
      </IconButton>
    }
    iconElementRight={iconElementRight}
  />
);

SecondaryNavHeader.displayName = 'SecondaryNavHeader';

SecondaryNavHeader.propTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  iconElementRight: PropTypes.element,
  style: PropTypes.object,
  iconColor: PropTypes.string,
};

export default SecondaryNavHeader;
