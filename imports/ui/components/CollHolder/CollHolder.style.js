import styled from 'styled-components';
import Paper from 'material-ui/Paper';

export const Wrapper = styled(Paper)`
  display: inline-block;
  width: calc(50% - 2px);
  max-width: 225px;
  margin-top: 4px;
  cursor: pointer;
  &:nth-of-type(even) {
    margin-left: 4px;
  }
`;

export const Cover = styled.section`
  width: 100%;
  height: 180px;
  backgroundColor: #eee;
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;  }
`;

export const Info = styled.section`
  margin: -18px 0 16px 12px;
  text-align: left;
`;

export const Avatar = styled.div`
  display: inline-block;
  width: 26px;
  height: 26px;
  & > img {
    width: 100%;
    height: 100%;
    border: 1px solid #fff;    
    border-radius: 50%;
  }
`;

export const CollName = styled.div`
  margin-top: 4px;
`;

export const UserName = styled.div`
  font-size: 13px;
  color: #666;
`;

export const Time = styled.time`
  display: block;
  font-size: 12px;
  color: #999;
`;
