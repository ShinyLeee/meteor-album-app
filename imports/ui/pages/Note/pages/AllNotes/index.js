import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncAllNotesContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class AllNotesPage extends Component {
  render() {
    return (
      <ViewLayout
        Topbar={<SecondaryNavHeader title="我收到的全部消息" />}
      >
        <AsyncAllNotesContent />
      </ViewLayout>
    );
  }
}
