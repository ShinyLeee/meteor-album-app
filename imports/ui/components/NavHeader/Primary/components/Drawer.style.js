import styled from 'styled-components';

export const DrawerProfile = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-size: cover;
`;

export const DrawerControlCenter = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
