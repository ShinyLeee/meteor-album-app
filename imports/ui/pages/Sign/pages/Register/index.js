import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncRegisterContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class RegisterPage extends Component {
  render() {
    return (
      <ViewLayout Topbar={<PrimaryNavHeader />}>
        <AsyncRegisterContent />
      </ViewLayout>
    );
  }
}
