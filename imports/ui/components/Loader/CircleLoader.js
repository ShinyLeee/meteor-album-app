import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';

const CircleLoader = ({ classes }) => (
  <CircularProgress
    classes={{ root: classes.progress, circle: classes.circle }}
    size={30}
  />
);

CircleLoader.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = {
  progress: {
    color: 'rgb(63, 81, 181)',
  },

  circle: {
    strokeWidth: 2.5,
  },
};

export default withStyles(styles)(CircleLoader);
