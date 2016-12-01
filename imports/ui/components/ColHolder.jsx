import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router';
import { mutateCollectionCover } from '/imports/api/collections/methods.js';
import { getRandomInt } from '/imports/utils/utils.js';

export default class ColHolder extends Component {

  constructor(props) {
    super(props);
    this.handleAccessCol = this.handleAccessCol.bind(this);
    this.state = {
      cover: undefined,
    };
  }

  componentWillMount() {
    const { col } = this.props;
    if (!col.cover && !col.quantity) {
      // We have 28 default background images
      const randomInt = getRandomInt(1, 28);
      const cover = `/img/pattern/VF_ac${randomInt}.jpg`;
      this.setState({ cover });
      mutateCollectionCover.call({ cover, colName: col.name });
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
    if (this.state.cover) {
      styles.colHolder = {
        backgroundSize: 'inherit',
        backgroundImage: `url(${this.state.cover})`,
      };
    }
    if (col.cover && col.cover.indexOf('VF_ac') > 0) {
      styles.colHolder = {
        backgroundSize: 'inherit',
        backgroundImage: `url(${col.cover})`,
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
