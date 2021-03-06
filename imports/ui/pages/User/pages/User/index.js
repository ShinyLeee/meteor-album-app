import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import PrimaryNavHeader from '/imports/ui/components/NavHeader/Primary';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncUserContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

class UserPage extends PureComponent {
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
        Topbar={
          isOwner
          ? <PrimaryNavHeader style={{ backgroundImage: 'linear-gradient(45deg, #874da2 0%, #c43a30 100%)' }} />
          : <SecondaryNavHeader title={`${curUserName}的主页`} />
        }
      >
        <AsyncUserContent isOwner={isOwner} />
      </ViewLayout>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

export default connect(mapStateToProps)(UserPage);
