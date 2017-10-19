import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncAllSentNotesContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class AllSentNotesPage extends Component {
  render() {
    return (
      <ViewLayout
        Topbar={<SecondaryNavHeader title="我发出的全部消息" />}
      >
        <AsyncAllSentNotesContent />
      </ViewLayout>
    );
  }
}
