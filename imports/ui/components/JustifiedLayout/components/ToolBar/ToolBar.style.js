import React from 'react';
import styled from 'styled-components';

export const Toolbar = styled.section`
  position: absolute;
  left: 0;
  top: -48px;
  width: 100%;
  height: 48px;
  line-height: 48px;
`;

const D = (props) => <div {...props} />; // eslint-disable-line

export const ToolbarLeft = styled(D)`
  position: absolute;
  left: 0;
  width: 50%;
  height: 48px;
  & > svg {
    margin-left: 8px;
    vertical-align: middle;
  }
  & > h4 {
    display: inline;
    margin-left: 8px;
    vertical-align: middle;
    font-family: 'Microsoft Yahei';
    font-weight: 500;
    font-size: 14px;
    color: #222;
  }
`;

export const ToolbarRight = styled.div`
  position: absolute;
  right: 0;
  width: 50%;
  height: 48px;
  text-align: right;
`;
