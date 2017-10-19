import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncLoginContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

// TODO add Recaptch in this Login page component
export default class LoginPage extends Component {
  render() {
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
        <AsyncLoginContent />
      </ViewLayout>
    );
  }
}
