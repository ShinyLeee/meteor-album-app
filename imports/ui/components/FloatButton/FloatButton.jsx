import React, { PropTypes } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import { Wrapper } from './FloatButton.style.js';

const FloatButton = ({ onBtnClick }) => (
  <Wrapper>
    <FloatingActionButton
      onTouchTap={onBtnClick}
      secondary
    ><AddIcon />
    </FloatingActionButton>
  </Wrapper>
);

FloatButton.displayName = 'FloatButton';

FloatButton.propTypes = {
  onBtnClick: PropTypes.func,
};

export default FloatButton;
