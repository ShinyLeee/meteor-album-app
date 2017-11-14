
import styled from 'styled-components';

export const Cover = styled.div`
  position: relative;
  height: 200px;
  background-size: cover;
  overflow: hidden;
  & > .setting__background {
    position: absolute;
    width: 100%;
    height: 100%;
    background: transparent;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3));
  }
`;

export const Uploader = styled.div`
  display: flex;
  width: 100%;
  height: 100px;      
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  margin-top: -50px;
  cursor: pointer;
`;

export const Username = styled.h2`
  margin-top: 0;
  padding: 0 24px;
  color: #444;
`;
