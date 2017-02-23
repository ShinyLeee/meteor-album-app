import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import { Wrapper, Child } from './GridLayout.style.js';

const GridLayout = ({ columns, gap, children }) => (
  <Wrapper margin={`${-gap / 2}px`}>
    {
      React.Children.map(children, (curChild) => (
        <Child
          childWidth={`${(100 / columns)}%`}
          padding={`${gap / 2}px`}
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
  onTileClick: PropTypes.func,
  children: PropTypes.any.isRequired,
};

export default pure(GridLayout);
