import styled from 'styled-components';

export const Logo = styled.header`
  width: 100%;
  height: 120px;
  padding: 12px 0;
  font-size: 48px;
  color: rgba(156, 39, 176, 0.8);
  text-align: center;
`;

export const Section = styled.section`
  padding: 0 10%;
  margin-bottom: 20px;
`;

export const Separator = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  font-family: 'Microsoft Yahei';
  font-size: 14px;
  color: #999;
  text-align: center;
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
  color: #777;
  font-size: 14px;
  text-align: center;
`;
