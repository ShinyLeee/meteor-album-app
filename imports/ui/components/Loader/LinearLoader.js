import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';

const LinearLoader = ({ style, classes }) => (
  <LinearProgress style={style} classes={{ root: classes.root }} mode="indeterminate" />
);

LinearLoader.propTypes = {
  style: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const styles = {
  root: {
    position: 'absolute',
    width: '100%',
    height: 5,
    zIndex: 999,
  },
};

export default withStyles(styles)(LinearLoader);
