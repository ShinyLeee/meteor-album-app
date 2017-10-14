import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 32vw;
`;

const Logo = styled.p`
  font-family: VT323, monaco, Consolas, "Lucida Console", monospace;
  font-size: 6.5vw;
  -webkit-font-smoothing: antialiased;
  margin-bottom: 36px;
`;

const ErrorLayout = ({ message }) => (
  <Wrapper>
    <Logo>Gallery Plus</Logo>
    <p>{message}</p>
  </Wrapper>
);

ErrorLayout.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorLayout;
