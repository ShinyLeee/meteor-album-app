import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  & > p {
    font-size: 12px;
  }
  & > button {
    align-self: flex-end;
  }
`;
