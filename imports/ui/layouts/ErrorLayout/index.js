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
`;

const Logo = styled.p`
  font-family: VT323, monaco, Consolas, "Lucida Console", monospace;
  font-size: 6.5vw;
  -webkit-font-smoothing: antialiased;
  margin-bottom: 36px;
`;

const Message = styled.p`
  margin: 0;
  padding: 12px 24px;
  word-break: break-all;
`;

const ErrorLayout = ({ title, message }) => (
  <Wrapper>
    <Logo>{title || 'Gallery Plus'}</Logo>
    <Message>{message}</Message>
  </Wrapper>
);

ErrorLayout.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
};

export default ErrorLayout;
