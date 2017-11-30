import PropTypes from 'prop-types';
import React from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

const FadeTransition = ({ children, ...props }) => (
  <CSSTransition
    classNames="fade"
    timeout={375}
    {...props}
    appear
  >
    {children}
  </CSSTransition>
);

FadeTransition.propTypes = {
  children: PropTypes.any.isRequired,
};

export default FadeTransition;
