import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import blue from 'material-ui/colors/blue';
import scrollTo from '/imports/vendor/scrollTo';
import NavHeader from '../NavHeader';
import { LeftContent, Content } from '../NavHeader.style';

const blue500 = blue[500];

class SecondaryNavHeader extends PureComponent {
  static propTypes = {
    height: PropTypes.number,
    style: PropTypes.object,
    titleStyle: PropTypes.object,
    iconStyle: PropTypes.object,
    title: PropTypes.string,
    Left: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.element,
    ]),
    Right: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.element,
    ]),
    onTitleClick: PropTypes.func,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    children: PropTypes.element,
  }

  _handleTitleClick = () => {
    if (this.props.onTitleClick) {
      this.props.onTitleClick();
    } else {
      scrollTo(0, 1500);
    }
  }

  render() {
    const {
      height,
      style,
      titleStyle,
      iconStyle,
      title,
      Left,
      Right,
      classes,
      history,
      children,
    } = this.props;
    return (
      <NavHeader height={height}>
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
                  className={classes.iconBtn}
                  style={iconStyle}
                  color="contrast"
                  aria-label="Back"
                  onClick={history.goBack}
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
                className={classes.title}
                type="title"
                color="inherit"
                onClick={this._handleTitleClick}
              >
                {title || '返回'}
              </Typography>
            </Content>

            {/* RightContent */}
            {Right}
          </Toolbar>

          {children}
        </AppBar>
      </NavHeader>
    );
  }
}

const styles = theme => ({
  appbar: {
    backgroundColor: blue500,
    backgroundImage: theme.palette.gradients.riverCity,
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.short,
    }),
  },

  toolbar: {
    minHeight: 64,
  },

  iconBtn: {
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
  },

  title: {
    height: 48,
    lineHeight: '48px',
    transition: theme.transitions.create('color', {
      duration: theme.transitions.duration.short,
    }),
  },
});

export default compose(
  withStyles(styles),
  withRouter,
)(SecondaryNavHeader);
