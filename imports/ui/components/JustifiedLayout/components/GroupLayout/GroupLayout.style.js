import React from 'react';
import styled from 'styled-components';

export const Wrapper = styled.section`
  position: relative;
  left: 0;
  top: 48px;
  width: 100%;
  margin-top: 48px;
`;

const H = (props) => <header {...props} />; // eslint-disable-line

export const Title = styled(H)`
  position: absolute;
  left: 0;
  top: -48px;
  width: 100%;
  height: 48px;
  line-height: 48px;
  & > svg {
    margin-left: 8px;
    vertical-align: middle;
  }
  & > h4 {
    display: inline;
    margin-left: 8px;
    vertical-align: middle;
    color: #222;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Microsoft Yahei';
  }
  & > span {
    position: absolute;
    right: 24px;
    display: inline-block;
    font-size: 14px;
    font-weight: 300;
    color: #222;
  }
`;
