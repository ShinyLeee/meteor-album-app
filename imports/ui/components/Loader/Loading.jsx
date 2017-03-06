import React, { PropTypes } from 'react';
import LinearProgress from 'material-ui/LinearProgress';

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

Loading.displayName = 'Loading';

Loading.propTypes = {
  style: PropTypes.object,
};

export default Loading;
