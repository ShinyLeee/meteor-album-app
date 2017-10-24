import React from 'react';
import CircleLoader from '/imports/ui/components/Loader/CircleLoader';
import styled from 'styled-components';

export const LoaderWrapper = styled.div`
  position: absolute;
  width: 100%;
  margin-top: 64px;
  text-align: center;
`;

// eslint-disable-next-line react/prop-types
export default function DataLoader({ bottom = false }) {
  const bottomStyle = {
    margin: 0,
    paddingBottom: 20,
    backgroundColor: '#eee',
  };
  return (
    <LoaderWrapper style={bottom ? bottomStyle : null}>
      <CircleLoader />
    </LoaderWrapper>
  );
}
