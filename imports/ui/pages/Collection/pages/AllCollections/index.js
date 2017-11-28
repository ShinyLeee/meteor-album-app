import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncAllCollectionContent = withLoadable({
  loader: () => import('./components/Content'),
});

class AllCollectionPage extends PureComponent {
  static propTypes = {
    User: PropTypes.object,
    match: PropTypes.object.isRequired,
  }

  state = {
    slideIndex: 0,
  }

  _handleTabChange = (e, value) => {
    window.scrollTo(0, 0);
    this.setState({ slideIndex: value });
  }

  _handleViewChange = (index) => {
    window.scrollTo(0, 0);
    this.setState({ slideIndex: index });
  }

  render() {
    const { User, match } = this.props;
    const curUserName = match.params.username;
    const isOwner = !!User && (User.username === curUserName);
    return (
      <ViewLayout
        Topbar={
          <SecondaryNavHeader title={isOwner ? '我的相册' : `${curUserName}的相册`}>
            <Tabs
              value={this.state.slideIndex}
              onChange={this._handleTabChange}
              indicatorColor="#fff"
              textColor="inherit"
              fullWidth
            >
              <Tab label={isOwner ? '我的' : `${curUserName}的`} value={0} />
              <Tab label={isOwner ? '已关注' : `${curUserName}关注的`} value={1} />
            </Tabs>
          </SecondaryNavHeader>
        }
        topbarHeight={112}
        loadingType="Circle"
        deep
      >
        <AsyncAllCollectionContent
          slideIndex={this.state.slideIndex}
          onViewChange={this._handleViewChange}
        />
      </ViewLayout>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

export default connect(mapStateToProps)(AllCollectionPage);
