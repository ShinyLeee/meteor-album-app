import PropTypes from 'prop-types';
import React from 'react';
import styles from './Label.style.js';

const Label = ({ text, type, onLabelClick }) => (
  <div
    className="component__Label"
    style={Object.assign({}, styles.label, styles[type])}
    role="button"
    tabIndex={-1}
    onClick={onLabelClick}
  >
    <span>{text}</span>
  </div>
);

Label.defaultProps = {
  type: 'default',
};

Label.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error']),
  onLabelClick: PropTypes.func,
};

export default Label;
