import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import scrollTo from '/imports/utils/scrollTo.js';

import styles from '../../NavHeader.style.js';

const SecondaryNavHeader = ({ title, iconElementRight, style }) => (
  <AppBar
    style={Object.assign({}, styles.AppBar, style)}
    title={title}
    titleStyle={styles.AppBarTitle}
    onTitleTouchTap={() => scrollTo(0, 1500)}
    iconElementLeft={
      <IconButton onTouchTap={() => browserHistory.goBack()}>
        <ArrowBackIcon />
      </IconButton>
    }
    iconElementRight={iconElementRight}
  />
);

SecondaryNavHeader.displayName = 'SecondaryNavHeader';

SecondaryNavHeader.propTypes = {
  title: PropTypes.string,
  iconElementRight: PropTypes.element,
  style: PropTypes.object,
};

export default SecondaryNavHeader;
