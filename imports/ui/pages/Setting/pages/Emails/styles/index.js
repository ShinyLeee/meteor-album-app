import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  & > p {
    padding: 0 16px;
    font-size: 12px;
  }
  & > button {
    align-self: flex-end;
    margin: 18px 24px 0 0;
  }
`;
