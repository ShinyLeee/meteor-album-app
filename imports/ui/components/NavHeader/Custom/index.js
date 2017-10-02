import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import scrollTo from '/imports/vendor/scrollTo.js';
import { LeftContent, Content } from '../NavHeader.style';

class CustomNavHeader extends Component {
  static propTypes = {
    title: PropTypes.string,
    Left: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.element,
    ]),
    Right: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.element,
    ]),
    style: PropTypes.object,
    classnames: PropTypes.object,
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  _handleTitleClick = () => {
    scrollTo(0, 1500);
  }

  render() {
    const { title, Left, Right, style, classnames, classes } = this.props;
    return (
      <AppBar
        className={classNames(classes.appbar, classnames.root)}
        style={style}
        position="fixed"
      >
        <Toolbar className={classNames(classes.toolbar, classnames.toolbar)}>
          {/* LeftContent */}
          <LeftContent>
            {Left}
          </LeftContent>

          {/* Content */}
          <Content className={classNames(classes.content, classnames.content)}>
            <Typography
              type="title"
              color="inherit"
              onClick={this._handleTitleClick}
            >
              {title}
            </Typography>
          </Content>

          {/* RightContent */}
          {Right}

        </Toolbar>
      </AppBar>
    );
  }
}

const styles = {
  appbar: {
    backgroundColor: '#fff',
  },

  toolbar: {
    minHeight: 64,
  },

  content: {
    color: '#666',
  },
};

export default withRouter(
  withStyles(styles)(CustomNavHeader)
);
