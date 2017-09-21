import styled from 'styled-components';
import withGesture from '../../../utils/gesture';

export const Wrapper = styled.div`
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const SliderTracker = styled.div`
  touch-action: none;
  transform: ${props => props.transform}
`;

export const EnhancedSliderTracker = withGesture(SliderTracker);
