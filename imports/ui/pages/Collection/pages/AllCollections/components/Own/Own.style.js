import styled from 'styled-components';
import Paper from 'material-ui/Paper';

export const inlineStyles = {
  addIcon: {
    width: '48px',
    height: '48px',
    color: '#676767',
  },
};

export const Wrapper = styled.div`
  padding-bottom: 30px;
`;

export const AddWrapper = styled(Paper)`
  display: inline-block;
  width: calc(50% - 2px);
  max-width: 200px;
  height: 270px;
  margin-top: 4px;
  vertical-align: top;
  cursor: pointer;
`;

export const AddSvgWrapper = styled.div`
  width: 48px;
  height: 48px;
  margin: 72px auto 0;
`;

export const AddMessage = styled.span`
  display: block;
  margin-top: 8px;
  color: #676767;
  text-align: center;
`;
