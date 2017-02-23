import React from 'react';
import styled from 'styled-components';

const D = (props) => <div {...props} />; // eslint-disable-line

export const Wrapper = styled(D)`
  position: relative;
  height: 240px;
  margin-bottom: 12px;
  border-radius: 6px;
  background-size: cover;
  background-position: 50%;
  overflow: hidden;
  cursor: pointer;
`;

export const Cover = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.2);
  -webkit-transition: background-color .2s ease-in-out;
  transition: background-color .2s ease-in-out;
  &:hover {
    background-color: rgba(0,0,0,.3);
  }
`;

export const CoverBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  background: linear-gradient(180deg,rgba(0,0,0,.3) 0,transparent 30%,transparent 70%,rgba(0,0,0,.3));
`;

export const Header = styled.header`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 18px 20px 20px;
`;

export const HeaderTime = styled.time`
  margin: 0;
  font-family: 'Microsoft Yahei';
  font-size: 12px;
  color: #fff;
  text-shadow: 0 1px 1px rgba(0,0,0,.1);
  opacity: .8;
`;

export const HeaderName = styled.h2`
  margin: 0;
  font-family: 'Microsoft Yahei';
  font-size: 18px;
  color: #fff;
  text-shadow: 0 1px 1px rgba(0,0,0,.1);
  line-height: 1.3;
`;

export const Footer = styled.footer`
  position: absolute;
  left: 18px;
  bottom: 20px;
  width: calc(100% - 40px);
  height: 32px;
`;

export const FooterAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
`;

export const FooterUsername = styled.span`
  margin: 0;
  font-size: 14px;
  color: #fff;
  text-shadow: 0 1px 1px rgba(0,0,0,.1);
  opacity: .8;
`;
