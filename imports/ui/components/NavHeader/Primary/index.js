import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import MenuIcon from 'material-ui-icons/Menu';
import IconButton from 'material-ui/IconButton';
import scrollTo from '/imports/vendor/scrollTo';
import Drawer from './components/Drawer';
import RightContent from './components/RightContent';
import { LeftContent, Content } from '../NavHeader.style';

class PrimaryNavHeader extends PureComponent {
  static propTypes = {
    onTitleClick: PropTypes.func,
    style: PropTypes.object,
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    drawer: false,
  }

  _handleTitleClick = () => {
    const { location, history } = this.props;
    scrollTo(0, 1500);
    if (location.pathname !== '/') {
      history.push('/');
    }
    if (this.props.onTitleClick) {
      this.props.onTitleClick();
    }
  }

  _handleToggleDrawer = () => {
    this.setState(prevState => ({ drawer: !prevState.drawer }));
  }

  _handleRequestClose = () => {
    this.setState({ drawer: false });
  }

  render() {
    const { style, classes } = this.props;
    return (
      <AppBar
        className={classes.appbar}
        style={style}
        position="fixed"
      >
        <Toolbar className={classes.toolbar}>
          {/* LeftContent */}
          <LeftContent>
            <IconButton
              className={classes.iconBtn}
              color="contrast"
              aria-label="Menu"
              onClick={this._handleToggleDrawer}
            ><MenuIcon />
            </IconButton>
            <Drawer
              visible={this.state.drawer}
              onRequestClose={this._handleRequestClose}
            />
          </LeftContent>

          {/* Content */}
          <Content>
            <Typography
              className={classes.title}
              type="title"
              color="inherit"
              onClick={this._handleTitleClick}
            >Gallery
            </Typography>
            <sup>&nbsp;+</sup>
          </Content>

          {/* RightContent */}
          <RightContent />

        </Toolbar>
      </AppBar>
    );
  }
}

const styles = theme => ({
  appbar: {
    backgroundColor: '#764ba2',
    backgroundImage: theme.palette.gradients.plumPlate,
  },

  toolbar: {
    minHeight: 64,
  },

  title: {
    display: 'inline',
  },

  iconBtn: {
    [theme.breakpoints.down('xs')]: {
      width: 42,
      height: 42,
    },
  },
});

export default compose(
  withStyles(styles),
  withRouter,
)(PrimaryNavHeader);
