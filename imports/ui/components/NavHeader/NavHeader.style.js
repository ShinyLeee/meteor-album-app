import styled from 'styled-components';

export const Wrapper = styled.header`
  position: relative;
  left: 0;
  top: 0;
  flex-shrink: 0;
`;

export const Filler = styled.div`
  position: relative;
  left: 0;
  top: 0;
  height: ${props => `${props.height}px`}
`;

export const LeftContent = styled.div`
  margin-right: 8px;
`;

export const Content = styled.div`
  flex: 1;
`;

export const RightContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
