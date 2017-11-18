import styled from 'styled-components';

export const Logo = styled.header`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  & > h2 {
    font-size: 54px;
    font-family: 'Pacifico', cursive;
    color: rgba(156, 39, 176, 0.8);
    @media (max-width: 320px) {
      font-size: 46px;
    }
  }
`;

export const Section = styled.section`
  padding: 0 10%;
  margin-bottom: 18px;
`;

export const Separator = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  font-family: 'Microsoft Yahei';
  font-size: 14px;
  color: #999;
  text-align: center;
  @media (max-width: 320px) {
    margin-top: 4px;
    margin-bottom: 4px;
  }
  &::before, &::after {
    position: relative;
    display: inline-block;
    background: rgba(0,0,0,0.2);
    -webkit-box-shadow: 0 1px 0 rgba(255,255,255,0.5);
    box-shadow: 0 1px 0 rgba(255,255,255,0.5);
    content: '';
    height: 1px;
    vertical-align: middle;
    width: 47%;
  }
`;

export const Footer = styled.footer`
  padding-bottom: 10px;
  color: #777;
  font-size: 12px;
  text-align: center;
`;
