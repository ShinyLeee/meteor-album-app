import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncIndexContent = withLoadable({
  loader: () => import('./containers/IndexContent'),
});

export default class IndexPage extends Component {
  render() {
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
        <AsyncIndexContent />
      </ViewLayout>
    );
  }
}
