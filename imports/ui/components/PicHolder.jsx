import React, { Component, PropTypes } from 'react';

export default class PicHolder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: 'PicHolder',
    };
  }

  render() {
    return (
      <div className="pic-holder">
        <div className="pic-holder-info">
          <a>最近的<span className="caret" /></a>
        </div>
        <div className="pic-holder-pic">
          <a href={this.props.image.url} target="_blank" rel="noopener noreferrer">
            <img src={this.props.image.url} alt={this.props.image.name} />
          </a>
        </div>
        <div className="pic-holder-action">
          <div className="pull-left">
            <a className="pic-holder-action-left">
              <i className="fa fa-heart" />
              <span>{this.props.image.like}</span>
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
