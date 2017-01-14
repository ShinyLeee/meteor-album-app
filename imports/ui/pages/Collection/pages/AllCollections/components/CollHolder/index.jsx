import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';
import { mutateCollectionCover } from '/imports/api/collections/methods.js';
import { getRandomInt } from '/imports/utils/utils.js';

export default class CollHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cover: undefined,
    };
  }

  componentWillMount() {
    const { col } = this.props;
    if (!col.cover) {
      // We have 28 default background images
      const randomInt = getRandomInt(1, 28);
      const cover = `/img/pattern/VF_ac${randomInt}.jpg`;
      this.setState({ cover });
      mutateCollectionCover.call({ cover, colName: col.name });
    }
  }

  render() {
    const { User, col, clientWidth } = this.props;
    const src = `${col.cover}?imageView2/0/w/${clientWidth * 2}`;
    // If the cover was set by user himself
    const styles = {
      colHolder: {
        backgroundSize: 'cover',
        backgroundImage: `url(${src})`,
      },
    };
    // When init collection
    if (this.state.cover) {
      styles.colHolder = {
        backgroundSize: 'inherit',
        backgroundImage: `url(${this.state.cover})`,
      };
    }
    // after mutateCollectionCover
    if (col.cover && col.cover.indexOf('VF_ac') > 0) {
      styles.colHolder = {
        backgroundSize: 'inherit',
        backgroundImage: `url(${col.cover})`,
      };
    }
    return (
      <div
        className="colHolder"
        style={styles.colHolder}
        onTouchTap={() => browserHistory.push(`/user/${User.username}/collection/${col.name}`)}
      >
        <div className="colHolder__cover">
          <div className="colHolder__background" />
          <div className="colHolder__header">
            <h4 className="colHolder__time">{moment(col.createdAt).format('YYYY-MM-DD')}</h4>
            <h2 className="colHolder__name">{col.name}</h2>
          </div>
          <div className="colHolder__footer">
            <img className="colHolder__avatar" src={User.profile.avatar} alt={User.username} />
            <span className="colHolder__username">{User.username}</span>
          </div>
        </div>
      </div>
    );
  }
}

CollHolder.propTypes = {
  User: PropTypes.object.isRequired,
  col: PropTypes.object.isRequired,
  clientWidth: PropTypes.number.isRequired,
};
