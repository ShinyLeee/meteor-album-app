import React, { PropTypes } from 'react';
import LinearProgress from 'material-ui/LinearProgress';

const Loading = ({ style }) => (
  <div className="component__Loading" style={style}>
    <LinearProgress mode="indeterminate" />
  </div>
);

Loading.displayName = 'Loading';

Loading.propTypes = {
  style: PropTypes.object,
};

export default Loading;
