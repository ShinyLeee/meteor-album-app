import PropTypes from 'prop-types';
import React from 'react';
import { LinearProgress } from 'material-ui/Progress';

const defaultStyle = {
  position: 'fixed',
  top: '64px',
  width: '100%',
};

const Loading = ({ style }) => (
  <div style={Object.assign({}, defaultStyle, style)}>
    <LinearProgress mode="indeterminate" />
  </div>
);

Loading.propTypes = {
  style: PropTypes.object,
};

export default Loading;
