import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';

class LinearLoader extends Component {
  static propTypes = {
    style: PropTypes.object,
    classes: PropTypes.object.isRequired,
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { style, classes } = this.props;
    return (
      <LinearProgress style={style} classes={{ root: classes.root }} mode="indeterminate" />
    );
  }
}

const styles = {
  root: {
    position: 'fixed',
    left: 0,
    top: 64,
    width: '100%',
    height: 5,
    zIndex: 999,
  },
};

export default withStyles(styles)(LinearLoader);
