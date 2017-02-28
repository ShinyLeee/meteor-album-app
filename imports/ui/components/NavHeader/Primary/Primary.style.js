import styled from 'styled-components';

export const DrawerProfile = styled.div`
  position: relative;
  height: 150px;
  background-size: cover;
`;

export const DrawerBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3));
`;

export const DrawerAvatar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 50%;
  padding: 24px 0 0px 26px;
  & > img {
    border: 1px solid #fff;
  }
`;

export const DrawerEmail = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 24px 24px 6px 20px;
  height: 50%;
  line-height: 55px;
  & > div {
    position: relative;
    & > span {
      position: absolute;
      left: 0;
      font-family: 'Microsoft yahei';
      font-size: 14px;
      color: #fff;
      text-shadow: 1px 2px 5px #222;
    }
    & > div {
      position: absolute;
      right: 0;
      & > svg {
        fill: #fff;
        vertical-align: middle;
      }
    }
  }
`;
