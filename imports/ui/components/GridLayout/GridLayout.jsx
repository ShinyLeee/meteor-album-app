import React, { Component, PropTypes } from 'react';

export default class GridLayout extends Component {
  render() {
    const { columns, gap, children } = this.props;
    return (
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
  }
}

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
