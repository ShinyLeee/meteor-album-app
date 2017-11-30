import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';

const withData = (options) => (WrappedComponent) => {
  const method = options.method;
  if (!method || typeof method !== 'function') {
    throw new Error('method is required in withData hoc');
  }

  return class extends PureComponent {
    static displayName = `withData(${WrappedComponent.displayName || WrappedComponent.name})`

    static state = {
      isDataReady: false,
      data: null,
    }

    async componentDidMount() {
      const data = await Meteor.callPromise(method);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ isDataReady: true, data });
    }

    componentWillUnmount() {
    }

    render() {
      return (
        <WrappedComponent
          isDataReady={this.state.isDataReady}
          {...this.state.data}
        />
      );
    }
  };
};

export default withData;
