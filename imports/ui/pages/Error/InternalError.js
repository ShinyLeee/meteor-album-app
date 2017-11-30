import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import ErrorHolder from './components/ErrorHolder';

export default class InternalError extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <ViewLayout
        Topbar={<PrimaryNavHeader />}
      >
        <ErrorHolder
          title="Error: 500 Unexpected Error"
          type="500"
          message="服务器内部发生错误"
        />
      </ViewLayout>
    );
  }
}
