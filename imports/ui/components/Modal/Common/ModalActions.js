import PropTypes from 'prop-types';
import React from 'react';
import Button from 'material-ui/Button';

const Actions = ({ primary, secondary, onConfirm, onCancel }) => [
  <Button
    key="action__cancel"
    color="primary"
    onClick={onCancel}
  >{ secondary || '取消' }
  </Button>,
  <Button
    key="action_confirm"
    color="primary"
    onClick={onConfirm}
  >{ primary || '确认' }
  </Button>,
];

Actions.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Actions;
