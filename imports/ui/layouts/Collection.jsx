import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import AddIcon from 'material-ui/svg-icons/content/add';

import { Collections } from '/imports/api/collections/collection.js';

import NavHeader from '../components/NavHeader.jsx';
import Recap from '../components/Recap.jsx';
import ColHolder from '../components/ColHolder.jsx';

const styles = {
  floatBtn: {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
  },
  colContainer: {
    padding: '0 12px',
  },
};

class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'collection',
    };
  }

  renderColHolder() {
    const { User, cols } = this.props;
    return cols.map((col) => (
      <ColHolder key={col._id} User={User} col={col} />
    ));
  }

  renderLoader() {
    return (
      <div className="content text-center">
        <CircularProgress style={{ top: '150px' }} size={1} />
      </div>
    );
  }

  render() {
    const { User, dataIsReady } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} primary />
        <div className="content">
          <Recap
            title="Collection"
            detailFir="所有经过分类的图片都在这里"
            detailSec="没有分类的图片都在默认分类集里"
          />
          <div className="col-container" style={styles.colContainer}>
            { dataIsReady ? this.renderColHolder() : this.renderLoader() }
          </div>
        </div>
        <FloatingActionButton
          style={styles.floatBtn}
          containerElement={<Link to="/upload" />}
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
  dataIsReady: PropTypes.bool.isRequired,
  cols: PropTypes.array.isRequired,
};

export default createContainer(() => {
  const colHandle = Meteor.subscribe('Collections.own');
  const dataIsReady = colHandle.ready();
  const cols = Collections.find({}, { sort: { createdAt: -1 } }).fetch();
  return {
    cols,
    dataIsReady,
  };
}, Collection);
