import styled from 'styled-components';
import Paper from 'material-ui/Paper';

const inlineStyles = {
  AddIcon: {
    width: '48px',
    height: '48px',
    color: '#676767',
  },
};

const AddWrapper = styled(Paper)`
  display: inline-block;
  width: calc(50% - 2px);
  max-width: 200px;
  height: 256px;
  margin-top: 4px;
  vertical-align: top;
  cursor: pointer;
`;

const AddSvgWrapper = styled.div`
  width: 48px;
  height: 48px;
  margin: 72px auto 0;
`;

const AddMessage = styled.span`
  display: block;
  margin-top: 8px;
  color: #676767;
  text-align: center;
`;

export { inlineStyles, AddWrapper, AddSvgWrapper, AddMessage };
