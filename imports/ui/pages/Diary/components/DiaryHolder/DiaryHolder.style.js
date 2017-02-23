/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  z-index: 1200;
  overflow-y: scroll;
`;

export const Body = styled.div`
  min-height: 100%;
`;

export const Article = styled.article`
  padding-top: 16px;
`;

export const Footer = styled.footer`
  padding: 12px 20px;
  text-align: right;
`;

export const Time = styled.time`
  letter-spacing: .5px;
  font-size: 13px;
  color: #999;
`;
