import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  flex: 1;  
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 128px;
  color: #222;
  & > p {
    font-size: 14px;
    color: #666;
  }
`;
