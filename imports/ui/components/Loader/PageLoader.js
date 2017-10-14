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

const SvgWrapper = styled.div`
  width: 30px;
  height: 30px;
`;

const PageLoader = () => (
  <Wrapper>
    <Logo>Gallery Plus</Logo>
    <SvgWrapper className="page-loader">
      <svg height="100%" viewBox="0 0 32 32" width="100%">
        <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: '#1da1f2', opacity: 0.2 }} />
        <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: '#1da1f2', strokeDasharray: 80, strokeDashoffset: 60 }} />
      </svg>
    </SvgWrapper>
  </Wrapper>
);

export default PageLoader;
