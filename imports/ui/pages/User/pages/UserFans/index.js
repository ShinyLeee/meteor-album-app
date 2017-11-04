import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncUserFansContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

class UserFansPage extends Component {
  static propTypes = {
    User: PropTypes.object,
    match: PropTypes.object.isRequired,
  }

  render() {
    const { User, match } = this.props;
    const curUserName = match.params.username;
    const isOwner = !!User && (User.username === curUserName);
    return (
      <ViewLayout
        Topbar={<SecondaryNavHeader title={isOwner ? '我的关注者' : `${curUserName}的关注者`} />}
      >
        <AsyncUserFansContent />
      </ViewLayout>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

export default connect(mapStateToProps)(UserFansPage);
