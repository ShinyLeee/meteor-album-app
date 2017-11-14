import styled from 'styled-components';
import Paper from 'material-ui/Paper';

export const List = styled(Paper)`
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

export const ListItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  & > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

export const Info = styled.div`
  margin-top: 6px;
  font-size: 14px;
  color: #222;
}
`;
