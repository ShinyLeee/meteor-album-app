/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

// 倒数第二个元素 --> React-Infinite占据了最后一个元素
export const Wrapper = styled.div`
  padding-bottom: 20px;
  &:nth-last-child(2) {
    padding-bottom: 0;
  }
`;

export const ActionButtonNum = styled.span`
  font-size: 12px;
  color: #444;
  opacity: ${props => props.visible ? 1 : 0};
`;
