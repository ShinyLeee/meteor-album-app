import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncUserLikesContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

class UserLikesPage extends Component {
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
        Topbar={<SecondaryNavHeader title={isOwner ? '我喜欢的' : `${curUserName}喜欢的`} />}
      >
        <AsyncUserLikesContent isOwner={isOwner} />
      </ViewLayout>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

export default connect(mapStateToProps)(UserLikesPage);
