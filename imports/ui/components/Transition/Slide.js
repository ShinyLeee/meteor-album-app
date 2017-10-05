import PropTypes from 'prop-types';
import React from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

const SlideTransition = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    classNames="slide"
    timeout={300}
    appear
  >
    {children}
  </CSSTransition>
);

SlideTransition.propTypes = {
  children: PropTypes.any.isRequired,
};

export default SlideTransition;
