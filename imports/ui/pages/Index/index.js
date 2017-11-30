import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import Recap from '/imports/ui/components/Recap';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncIndexContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class IndexPage extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <ViewLayout
        Topbar={<PrimaryNavHeader />}
        deep
      >
        <Recap />
        <AsyncIndexContent />
      </ViewLayout>
    );
  }
}
