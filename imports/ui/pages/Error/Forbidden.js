import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import ErrorHolder from './components/ErrorHolder';

export default class Forbidden extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <ViewLayout
        Topbar={<PrimaryNavHeader />}
      >
        <ErrorHolder
          title="Error: 403 Access Denied"
          type="403"
          message="您没有权限访问该页面"
        />
      </ViewLayout>
    );
  }
}
