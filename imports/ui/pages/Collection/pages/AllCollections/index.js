import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import blue from 'material-ui/colors/blue';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { SecondaryNavHeader } from '/imports/ui/components/NavHeader';
// import withLoadable from '/imports/ui/hocs/withLoadable';
// import Loading from './components/Loading';
import Content from './components/Content';

// const AsyncContent = withLoadable({
//   loader: () => import('./components/Content'),
//   loading: Loading,
// });

const styles = {
  appbar: {
    top: 64,
    backgroundColor: blue[500],
    boxShadow: 'none',
  },
};

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
          <SecondaryNavHeader
            style={{ boxShadow: 'none' }}
            title={isOwner ? '我的相册' : `${curUserName}的相册`}
          />
        }
      >
        <AppBar style={styles.appbar} position="fixed" color="primary">
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
        </AppBar>
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
