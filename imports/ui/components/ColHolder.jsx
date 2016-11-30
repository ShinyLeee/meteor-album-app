import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router';
import { getRandomInt } from '/imports/utils/utils.js';

export default class ColHolder extends Component {

  constructor(props) {
    super(props);
    this.handleAccessCol = this.handleAccessCol.bind(this);
  }

  componentWillMount() {
    const { col } = this.props;
    // If this collection have no photo, we give it a default backgroundImage
    if (col.quantity === 0) {
      // We have 28 default background images in remote
      const randomInt = getRandomInt(1, 28);
      this.setState({ randomInt });
    }
  }

  handleAccessCol(location) {
    browserHistory.push(`/collection/${location}`);
  }

  render() {
    const { User, col } = this.props;
    const styles = {
      colHolder: {
        backgroundSize: 'cover',
        backgroundImage: `url(${col.cover})`,
      },
    };
    if (!col.cover || !col.quantity) {
      const { randomInt } = this.state;
      styles.colHolder = {
        backgroundSize: 'inherit',
        backgroundImage: `url(http://odsiu8xnd.bkt.clouddn.com//vivian/background/VF_ac${randomInt}.jpg)`,
      };
    }
    return (
      <div
        className="col-holder"
        style={styles.colHolder}
        onTouchTap={() => this.handleAccessCol(col.name)}
      >
        <div className="col-cover">
          <div className="col-background" />
          <div className="col-header">
            <h4 className="col-header-time">
              {moment(col.createdAt).format('YYYY-MM-DD')}
            </h4>
            <h2 className="col-header-name">
              {col.name}
            </h2>
          </div>
          <div className="col-footer">
            <img src={User.profile.avatar} alt={User.username} className="col-footer-avatar" />
            <span className="col-footer-username">
              {User.username}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

ColHolder.propTypes = {
  User: PropTypes.object.isRequired,
  col: PropTypes.object.isRequired,
};
