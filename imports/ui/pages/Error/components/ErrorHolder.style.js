import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;    
  align-items: center;
  justify-content: center;    
`;

export const Title = styled.h2`
  font-size: 26px;
  color: #222;
  text-align: center;
`;

export const Image = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  & > img {
    width: 280px;
    height: auto;
  }
`;

export const Message = styled.p`
  font-size: 12px;
  color: #666;
`;
