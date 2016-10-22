import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class PicHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'PicHolder',
    };
  }

  render() {
    const { image } = this.props;
    return (
      <div className="pic-holder">
        <div className="pic-holder-info">
          <img className="pic-holder-info-avatar" src={image.avatar} alt="User-avatar" />
          <div>
            <span className="pic-holder-info-title">
            {image.username}
            </span>
            <span className="pic-holder-info-subtitle">
            {moment(image.createdAt).format('YYYY-MM-DD')}
            </span>
          </div>
        </div>
        <div className="pic-holder-pic">
          <a href={image.url} target="_blank" rel="noopener noreferrer">
            <img src={image.url} alt={image.name} />
          </a>
        </div>
        <div className="pic-holder-action">
          <div className="pull-left">
            <a className="pic-holder-action-left">
              <i className="fa fa-heart" />
              <span>{image.like}</span>
            </a>
            <a>
              <span className="fa fa-plus" />
            </a>
          </div>
          <div className="pull-right">
            <a className="pic-holder-action-right">
              <span className="fa fa-download" />
            </a>
          </div> {/* ACTION RIGHT */}
        </div> {/* PIC-HOLDER ACTION */}
      </div> /* PIC-HOLDER */
    );
  }
}

PicHolder.propTypes = {
  image: PropTypes.object.isRequired,
};
