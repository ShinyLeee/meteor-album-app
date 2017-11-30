import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Wrapper, Filler } from './NavHeader.style';

export default class NavHeader extends PureComponent {
  static propTypes = {
    height: PropTypes.number,
    children: PropTypes.element.isRequired,
  }

  static defaultProps = {
    height: 64,
  }

  render() {
    const { height, children } = this.props;
    return (
      <Wrapper>
        <Filler height={height} />
        {children}
      </Wrapper>
    );
  }
}
