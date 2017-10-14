import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import teal from 'material-ui/colors/teal';
import withLoadable from '/imports/ui/hocs/withLoadable';
import ViewLayout from '/imports/ui/layouts/ViewLayout/Unstable';
import { LinearLoader } from '/imports/ui/components/Loader';
import { PrimaryNavHeader, SecondaryNavHeader } from '/imports/ui/components/NavHeader';

const teal500 = teal[500];

const AsyncContent = withLoadable({
  loader: () => import('./ContentContainer'),
  loading: () => <LinearLoader style={{ top: 64 }} />,
});

class UserPage extends Component {
  static propTypes = {
    User: PropTypes.object,
    match: PropTypes.object.isRequired,
  }

  render() {
    const { User, match } = this.props;
    const isOwner = !!User && (User.username === match.params.username);
    return (
      <ViewLayout
        Topbar={
          isOwner
          ? <PrimaryNavHeader style={{ backgroundColor: teal500 }} />
          : <SecondaryNavHeader title={`${match.params.username}的主页`} />
        }
      >
        <AsyncContent isOwner={isOwner} />
      </ViewLayout>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

export default connect(mapStateToProps)(UserPage);
