import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import Content from './components/Content';

class AllCollectionPage extends Component {
  static propTypes = {
    User: PropTypes.object,
    match: PropTypes.object.isRequired,
  }

  state = {
    slideIndex: 0,
  }

  _handleViewIndex = (e, index) => {
    this.setState({
      slideIndex: index,
    });
  }

  render() {
    const { User, match } = this.props;
    const curUserName = match.params.username;
    const isOwner = !!User && (User.username === curUserName);
    return (
      <ViewLayout
        deep
        Topbar={
          <SecondaryNavHeader title={isOwner ? '我的相册' : `${curUserName}的相册`}>
            <Tabs
              value={this.state.slideIndex}
              onChange={this._handleViewIndex}
              indicatorColor="#fff"
              textColor="inherit"
              fullWidth
            >
              <Tab label={isOwner ? '我的' : `${curUserName}的`} value={0} />
              <Tab label={isOwner ? '已关注' : `${curUserName}关注的`} value={1} />
            </Tabs>
          </SecondaryNavHeader>
        }
      >
        <Content
          slideIndex={this.state.slideIndex}
          onViewChange={this._handleViewIndex}
        />
      </ViewLayout>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

export default connect(mapStateToProps)(AllCollectionPage);
