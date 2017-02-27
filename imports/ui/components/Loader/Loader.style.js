import styled from 'styled-components';

export const LoaderContent = styled.div`
  position: relative;
  min-height: 40px;
  line-height: 40px;
  margin: 0 12px;
`;

export const LoaderProgress = styled.div`
  position: absolute;
  left: 25px;
  top: 5px;
`;

export const LoaderMessage = styled.div`
  position: absolute;
  left: 90px;
  color: #222;
  font-size: 14px;
`;
