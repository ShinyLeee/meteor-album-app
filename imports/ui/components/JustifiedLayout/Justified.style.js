/* eslint-disable no-confusing-arrow */
import React from 'react';
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  left: 0;
  top: ${props => props.isDefaultLayout ? 0 : '48px'};
  margin-bottom: 48px;
`;

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
    color: #222;
    font-size: 14px;
    font-family: 'Microsoft Yahei';
  }
`;

export const ToolbarRight = styled.div`
  position: absolute;
  right: 0;
  width: 50%;
  height: 48px;
  text-align: right;
`;
