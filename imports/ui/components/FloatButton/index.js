import PropTypes from 'prop-types';
import React from 'react';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { Wrapper } from './FloatButton.style';

const FloatButton = ({ onClick }) => (
  <Wrapper>
    <Button
      onClick={onClick}
      color="accent"
      fab
    ><AddIcon />
    </Button>
  </Wrapper>
);

FloatButton.propTypes = {
  onClick: PropTypes.func,
};

export default FloatButton;
