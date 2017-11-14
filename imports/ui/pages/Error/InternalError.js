import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import ErrorHolder from './components/ErrorHolder';

export default class InternalError extends Component {
  render() {
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
        <ContentLayout fullScreen>
          <ErrorHolder
            title="Error: 500 Unexpected Error"
            type="500"
            message="服务器内部发生错误"
          />
        </ContentLayout>
      </ViewLayout>
    );
  }
}
