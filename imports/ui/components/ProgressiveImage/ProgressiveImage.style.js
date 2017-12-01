import styled from 'styled-components';

export const Wrapper = styled.figure`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  overflow: hidden;
  & > span { /* Aspect Ratio Filler */
    display: block;
    width: 100%;
  }
  & > img { /* Tiny Image */
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(10px);
  }
  & > div { /* Transition Group wrapped the real Image */
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    & > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

export const ErrorHolder = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  background: linear-gradient(180deg, transparent 0, rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 0.22) 60%, transparent);  
  text-shadow: #fff 0px 0px 6px;
  color: #fff;  
  & > svg {
    margin-right: 12px;
  }
`;

export const Cover = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  & > div {
    position: absolute;
    width: 100%;
    height: 100%;
    background: transparent;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3));    
  }
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
