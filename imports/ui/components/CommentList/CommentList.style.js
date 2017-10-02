import styled from 'styled-components';
import List from 'material-ui/List';

export const CommentsWrapper = styled.div`
  border-top: 1px solid #ebebeb;
  overflow-x: hidden;
`;

export const CommentsSection = styled(List)`
  max-height: 275px;
  overflow-y: scroll;
  & > div:first-child {
    border-top: 1px solid #ebebeb;
  }
`;

export const CommentsContent = styled.div`
  flex: 1 1 auto;
  padding: 0 16px;
  font-weight: 400;  
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  & > h3 {
    margin: 0;
    color: rgba(0, 0, 0, 0.87);
    font-size: 16px;
    line-height: 24px;
  }
  & > div {
    color: rgba(0, 0, 0, 0.54);
    font-size: 14px;
    line-height: 20px;
  }
`;

export const CommentsTime = styled.div`
  display: flex;
  align-self: flex-start;
  & > time {
    color: #666;
    font-size: 12px;
    word-wrap: break-word;
  }
`;

export const PublishSection = styled.section`
  position: relative;
  padding: 12px 16px 8px;
  border-top: 1px solid #ebebeb;
`;

export const PublishContent = styled.div`
  display: flex;
`;


export const PublishFooter = styled.footer`
  text-align: right;
`;
