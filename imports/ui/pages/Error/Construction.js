import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import ErrorHolder from './components/ErrorHolder';

export default class Construction extends Component {
  render() {
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
        <ContentLayout fullScreen>
          <ErrorHolder
            title="This Page is Under Construction"
            type="Construction"
            message="该页面正在紧张的开发中"
          />
        </ContentLayout>
      </ViewLayout>
    );
  }
}
