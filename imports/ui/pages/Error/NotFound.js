import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import ErrorHolder from './components/ErrorHolder';

export default class NotFound extends Component {
  render() {
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
        <ContentLayout fullScreen>
          <ErrorHolder
            title="Error: 404 Page Not Found"
            type="404"
            message="您访问的这个页面不存在"
          />
        </ContentLayout>
      </ViewLayout>
    );
  }
}
