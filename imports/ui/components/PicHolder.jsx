import React, { Component, PropTypes } from 'react';
import moment from 'moment';

// import HeartIcon from 'material-ui/svg-icons/action/favorite';
import EmptyHeartIcon from 'material-ui/svg-icons/action/favorite-border';
import AddIcon from 'material-ui/svg-icons/content/add';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';

export default class PicHolder extends Component {

  constructor(props) {
    super(props);
    this.handleAddLike = this.handleAddLike.bind(this);
    this.handleAddCollection = this.handleAddCollection.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  handleAddLike() {
    const { User } = this.props;
  }

  handleAddCollection() {
    const { User } = this.props;
  }

  handleDownload() {
    console.log('download');
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
            <a
              className="pic-holder-action-left"
              onTouchTap={this.handleAddLike}
            >
              <EmptyHeartIcon />
            </a>
            <a onTouchTap={this.handleAddCollection}>
              <AddIcon />
            </a>
          </div>
          <div className="pull-right">
            <a
              className="pic-holder-action-right"
              onTouchTap={this.handleDownload}
            >
              <DownloadIcon />
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
