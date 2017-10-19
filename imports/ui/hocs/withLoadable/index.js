/* eslint-disable new-cap */
import React from 'react';
import Loadable from 'react-loadable';
import LinearLoader from '/imports/ui/components/Loader/LinearLoader';

export default function withLoadable(opts) {
  return Loadable({
    loading: () => <LinearLoader style={{ top: 64 }} />,
    delay: 200,
    timeout: 500,
    ...opts,
  });
}
