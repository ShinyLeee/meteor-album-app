import styled from 'styled-components';

export const DrawerProfile = styled.div`
  display: flex;
  flex-direction: column;
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
  flex: 3;
  align-items: center;
  display: flex;
  padding-left: 24px;
`;

export const DrawerEmail = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  justify-content: space-around;
  align-items: center;
  font-family: arial;  
  color: #fff;  
`;
