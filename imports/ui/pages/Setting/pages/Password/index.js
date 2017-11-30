import React, { Component } from 'react';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncPasswordContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class PasswordPage extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <ViewLayout
        Topbar={<SecondaryNavHeader title="修改密码" />}
      >
        <AsyncPasswordContent />
      </ViewLayout>
    );
  }
}
