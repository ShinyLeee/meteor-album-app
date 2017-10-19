import PropTypes from 'prop-types';
import React from 'react';
import { Wrapper, Child } from './GridLayout.style';

const GridLayout = ({ columns, gap, children }) => (
  <Wrapper margin={`${-gap / 2}px`}>
    {
      React.Children.map(children, (curChild) => (
        <Child
          childWidth={`${(100 / columns)}%`}
          padding={`0 ${gap / 2}px`}
          paddingBottom={`${(100 / columns)}%`}
        >
          {curChild}
        </Child>
      ))
    }
  </Wrapper>
);

GridLayout.displayName = 'GridLayout';

GridLayout.defaultProps = {
  columns: 3,
  gap: 4,
};

GridLayout.propTypes = {
  columns: PropTypes.number,
  gap: PropTypes.number,
  children: PropTypes.any.isRequired,
};

export default GridLayout;
