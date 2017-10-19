import React from 'react';
import CircleLoader from '/imports/ui/components/Loader/CircleLoader';
import styled from 'styled-components';

export const LoaderWrapper = styled.div`
  position: absolute;
  width: 100%;
  margin-top: 64px;
  text-align: center;
`;

export default function DataLoader() {
  return (
    <LoaderWrapper>
      <CircleLoader />
    </LoaderWrapper>
  );
}
