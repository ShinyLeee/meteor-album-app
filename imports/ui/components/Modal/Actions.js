import PropTypes from 'prop-types';
import React from 'react';
import Button from 'material-ui/Button';

const Actions = ({ primary, secondary, pClick, sClick }) => (
  <div>
    <Button
      key="action__cancel"
      color="primary"
      onClick={sClick}
    >{ secondary || '取消' }
    </Button>
    <Button
      key="action_confirm"
      color="primary"
      onClick={pClick}
    >{ primary || '确认' }
    </Button>
  </div>
);

Actions.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  pClick: PropTypes.func.isRequired,
  sClick: PropTypes.func.isRequired,
};

export default Actions;
