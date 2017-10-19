import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncEmailsContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class EmailsPage extends Component {
  render() {
    return (
      <ViewLayout Topbar={<SecondaryNavHeader title="我的邮箱" />}>
        <AsyncEmailsContent />
      </ViewLayout>
    );
  }
}
