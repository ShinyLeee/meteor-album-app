/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

export const Toolbar = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: right;
`;

export const ToolbarLeft = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin-left: 8px;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  & > h4 {
    margin-left: 8px;
    font-family: 'Microsoft Yahei';
    font-weight: 500;
    font-size: 14px;
    color: #222;
  }
`;
