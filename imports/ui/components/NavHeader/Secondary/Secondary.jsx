import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import { blue500 } from 'material-ui/styles/colors.js';
import scrollTo from '/imports/vendor/scrollTo.js';
import { Wrapper, styles } from '../NavHeader.style.js';

const SecondaryNavHeader = (props) => {
  const {
    children,
    titleStyle,
    iconElementLeft,
    style,
    iconColor,
    ...others
  } = props;
  return (
    <Wrapper>
      <AppBar
        style={Object.assign({}, { backgroundColor: blue500 }, style)}
        titleStyle={Object.assign({}, styles.AppBarTitle, titleStyle)}
        onTitleTouchTap={() => scrollTo(0, 1500)}
        iconElementLeft={
          !iconElementLeft
          ? (<IconButton onTouchTap={() => browserHistory.goBack()}>
            <ArrowBackIcon color={iconColor || '#fff'} />
          </IconButton>)
          : iconElementLeft
        }
        {...others}
      />
      {children}
    </Wrapper>
  );
};

SecondaryNavHeader.displayName = 'SecondaryNavHeader';

SecondaryNavHeader.propTypes = {
  children: PropTypes.any,
  titleStyle: PropTypes.object,
  iconElementLeft: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.element,
  ]),
  style: PropTypes.object,
  iconColor: PropTypes.string,
};

export default SecondaryNavHeader;
