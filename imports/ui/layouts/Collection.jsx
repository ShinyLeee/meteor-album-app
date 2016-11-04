import React, { Component, PropTypes } from 'react';
// import { Meteor } from 'meteor/meteor';
// import { createContainer } from 'meteor/react-meteor-data';

import FloatingActionButton from 'material-ui/FloatingActionButton';
// import CircularProgress from 'material-ui/CircularProgress';
import AddIcon from 'material-ui/svg-icons/content/add';

import NavHeader from '../components/NavHeader.jsx';
import Recap from '../components/Recap.jsx';

export default class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'collection',
    };
  }

  render() {
    const { User } = this.props;
    const styles = {
      floatBtn: {
        position: 'fixed',
        right: '16px',
        bottom: '16px',
      },
    };
    return (
      <div className="container">
        <NavHeader
          User={User}
          location={this.state.location}
        />
        <div className="content">
          <Recap
            title="Collection"
            detailFir="所有经过分类的图片都在这里"
            detailSec="没有分类的图片都在默认分类集里"
          />
        </div>
        <FloatingActionButton
          style={styles.floatBtn}
          secondary
        >
          <AddIcon />
        </FloatingActionButton>
      </div>
    );
  }

}

Collection.propTypes = {
  User: PropTypes.object,
};
