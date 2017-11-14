import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 200px;  
  padding: 16px 24px;
  &:not(:last-child) {
    border-bottom: 1px solid #ebebeb;
  }
  &:first-child {
    border-bottom: 1px solid #ebebeb;
  }
`;

export const Title = styled.h3`
  margin: 0;
`;

export const Article = styled.article`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: #666;  
`;

export const Footer = styled.footer`
  & > time {
    letter-spacing: .5px;
    font-size: 13px;
    color: #999;
  }
`;
