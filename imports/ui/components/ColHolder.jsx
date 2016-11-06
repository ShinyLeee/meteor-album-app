import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class ColHolder extends Component {

  constructor(props) {
    super(props);
    this.handleAccessCol = this.handleAccessCol.bind(this);
  }

  handleAccessCol(location) {
    this.context.router.push(`/collection/${location}`);
  }

  render() {
    const { User, col } = this.props;
    const styles = {
      colCover: {
        backgroundColor: 'transparent',
        backgroundImage: `url(${col.cover})`,
        backgroundSize: 'cover',
        backgroundPosition: '50%',
      },
    };
    return (
      <div className="col-holder" onTouchTap={() => this.handleAccessCol(col.name)}>
        <div className="col-cover" style={styles.colCover}>
          <div className="col-background" />
        </div>
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
    );
  }
}

// If contextTypes is not defined, then context will be an empty object.
ColHolder.contextTypes = {
  router: PropTypes.object.isRequired,
};

ColHolder.propTypes = {
  User: PropTypes.object,
  col: PropTypes.object.isRequired,
};
