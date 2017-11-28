import React from 'react';
import Loadable from 'react-loadable';
import LoadingComponent from './LoadingComponent';
import LoadedComponent from './LoadedComponent';

export default function withLoadable(opts) {
  return Loadable({
    delay: 0, // 不延迟因为我们实际使用的loading组件不在此
    timeout: 10000,
    loading: (props) => (
      <LoadingComponent {...props} />
    ),
    ...opts,
    render: (loaded, props) => {
      const Element = loaded.default;
      const displayName = Element.displayName || Element.name;
      return (
        <LoadedComponent name={displayName} preserved={props}>
          {(p) => <Element {...p} />}
        </LoadedComponent>
      );
    },
  });
}
