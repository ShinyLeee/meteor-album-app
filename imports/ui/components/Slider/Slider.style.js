import styled from 'styled-components';
import withGesture from '/imports/ui/hocs/withGesture';

export const Wrapper = styled.div`
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
`;

const SliderTracker = styled.div`
  touch-action: none;
  transform: ${props => props.transform}
`;

export const EnhancedSliderTracker = withGesture(SliderTracker);
