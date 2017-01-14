import React, { PropTypes } from 'react';
import pure from 'recompose/pure';

const GridLayout = ({ columns, gap, children }) => (
  <div style={{ margin: `${-gap / 2}px` }}>
    {
      React.Children.map(children, (curChild) => {
        const childStyle = Object.assign({}, {
          display: 'inline-block',
          width: `${(100 / columns)}%`,
          height: 0,
          padding: `${gap / 2}px`,
          paddingBottom: `${(100 / columns)}%`,
          verticalAlign: 'top',
        });
        return (
          <div style={childStyle}>{curChild}</div>
        );
      })
    }
  </div>
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
