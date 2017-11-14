/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

export const Wrapper = styled.div`
  padding-bottom: 20px;
`;

export const ActionButtonNum = styled.span`
  font-size: 12px;
  color: #444;
  opacity: ${props => props.visible ? 1 : 0};
`;
