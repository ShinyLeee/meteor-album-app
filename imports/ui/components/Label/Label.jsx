import React, { PropTypes } from 'react';
import styles from './Label.style.js';

const Label = ({ text, type, onLabelClick }) => (
  <div
    className="component__Label"
    style={Object.assign({}, styles.label, styles[type])}
    onTouchTap={onLabelClick}
  >
    <span>{text}</span>
  </div>
);

Label.defaultProps = {
  text: 'Label',
  type: 'default',
};

Label.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error']),
  onLabelClick: PropTypes.func,
};

export default Label;
