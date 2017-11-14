import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import ErrorHolder from './components/ErrorHolder';

export default class Forbidden extends Component {
  render() {
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
        <ContentLayout fullScreen>
          <ErrorHolder
            title="Error: 403 Access Denied"
            type="403"
            message="您没有权限访问该页面"
          />
        </ContentLayout>
      </ViewLayout>
    );
  }
}
