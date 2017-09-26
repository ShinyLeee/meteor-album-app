import React, { PropTypes } from 'react';
import { withRouter } from 'react-router-dom';
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
    iconElementRight,
    style,
    iconColor,
    history,
  } = props;
  return (
    <Wrapper>
      <AppBar
        style={Object.assign({}, { backgroundColor: blue500 }, style)}
        titleStyle={Object.assign({}, styles.AppBarTitle, titleStyle)}
        onTitleTouchTap={() => scrollTo(0, 1500)}
        iconElementLeft={
          !iconElementLeft
          ? (
            <IconButton onTouchTap={() => history.goBack()}>
              <ArrowBackIcon color={iconColor || '#fff'} />
            </IconButton>
          )
          : iconElementLeft
        }
        iconElementRight={iconElementRight}
      />
      {children}
    </Wrapper>
  );
};

SecondaryNavHeader.propTypes = {
  children: PropTypes.any,
  titleStyle: PropTypes.object,
  iconElementLeft: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.element,
  ]),
  iconElementRight: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.element,
  ]),
  style: PropTypes.object,
  iconColor: PropTypes.string,
  // Pass from React-Router
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(SecondaryNavHeader);
