import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import blue from 'material-ui/colors/blue';
import scrollTo from '/imports/vendor/scrollTo.js';
import { LeftContent, Content } from '../NavHeader.style';

const blue500 = blue[500];

const SecondaryNavHeader = (props) => {
  const {
    style,
    titleStyle,
    iconStyle,
    title,
    Left,
    Right,
    classes,
    history,
  } = props;

  return (
    <AppBar
      className={classes.appbar}
      style={style}
      position="fixed"
    >
      <Toolbar className={classes.toolbar}>
        {/* LeftContent */}
        {
          !Left
          ? (
            <LeftContent>
              <IconButton
                style={iconStyle}
                color="contrast"
                aria-label="Back"
                onClick={() => history.goBack()}
              >
                <ArrowBackIcon />
              </IconButton>
            </LeftContent>
          )
          : Left
        }

        {/* Content */}
        <Content style={titleStyle}>
          <Typography
            type="title"
            color="inherit"
            onClick={() => scrollTo(0, 1500)}
          >
            {title}
          </Typography>
        </Content>

        {/* RightContent */}
        {Right}

      </Toolbar>
    </AppBar>
  );
};

SecondaryNavHeader.propTypes = {
  style: PropTypes.object,
  titleStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  title: PropTypes.string,
  Left: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.element,
  ]),
  Right: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.element,
  ]),
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const styles = {
  appbar: {
    backgroundColor: blue500,
  },

  toolbar: {
    minHeight: 64,
  },
};

export default compose(
  withStyles(styles),
  withRouter,
)(SecondaryNavHeader);
