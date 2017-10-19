import PropTypes from 'prop-types';
import React from 'react';
import { SelectIcon } from './snippet.style';

const JustifiedSelectIcon = (props) => {
  const { activate } = props;
  return (
    <SelectIcon activate={activate} width="24px" height="24px" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </SelectIcon>
  );
};

JustifiedSelectIcon.defaultProps = {
  activate: false,
};

JustifiedSelectIcon.propTypes = {
  activate: PropTypes.bool,
};

export default JustifiedSelectIcon;
