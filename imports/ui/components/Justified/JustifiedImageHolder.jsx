/* eslint max-len: 0 */
import React, { Component, PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { connect } from 'react-redux';

import { selectCounter } from '../../actions/actionTypes.js';

class JustifiedImageHolder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelect: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { total, day, groupTotal } = this.props;
    if (nextProps.counter === total) {
      this.setState({ isSelect: true });
      return;
    }
    if (nextProps.counter === 0) {
      this.setState({ isSelect: false });
      return;
    }
    _.map(nextProps.group, (value, key) => {
      if (key === day && value === groupTotal) this.setState({ isSelect: true });
      if (key === day && value === 0) this.setState({ isSelect: false });
    });
  }

  handleSelect() {
    const { day, isEditing, dispatch } = this.props;
    if (isEditing) {
      if (this.state.isSelect) {
        dispatch(selectCounter({ group: day, counter: -1 }));
        this.setState({ isSelect: false });
      } else {
        dispatch(selectCounter({ group: day, counter: 1 }));
        this.setState({ isSelect: true });
      }
    }
  }

  render() {
    const { image, imageSource, style, backgroundStyle } = this.props;
    const isSelect = this.state.isSelect;
    const backgroundClassName = isSelect ? 'justified-image-select-background-selected' : 'justified-image-select-background';
    const styles = {
      svgBgd: {
        position: 'absolute',
        display: isSelect ? 'block' : 'none',
      },
      svgSelected: {
        fill: isSelect ? '#4285f4' : '#fff',
        opacity: isSelect ? 1 : 0,
        fillOpacity: isSelect ? 1 : 0,
      },
      image: {
        transform: isSelect && 'scale(.8)',
      },
    };
    return (
      <div
        className="justified-image-holder"
        style={style}
        onTouchTap={this.handleSelect}
      >
        <div className={backgroundClassName} style={backgroundStyle}>
          <svg width="24px" height="24px" className="justified-image-select" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
          <svg width="24px" height="24px" style={styles.svgBgd} viewBox="0 0 24 24">
            <radialGradient id="shadow" cx="38" cy="95.488" r="10.488" gradientTransform="matrix(1 0 0 -1 -26 109)" gradientUnits="userSpaceOnUse">
              <stop offset=".832" stopColor="#010101" /><stop offset="1" stopColor="#010101" stopOpacity="0" />
            </radialGradient>
            <circle opacity=".26" fill="url(#shadow)" cx="12" cy="13.512" r="10.488" />
            <circle fill="#FFF" cx="12" cy="12.2" r="8.292" />
          </svg>
          <svg width="24px" height="24px" style={styles.svgSelected} className="justified-image-selected" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <img src={imageSource} alt={image.name} style={styles.image} />
      </div>
    );
  }
}

JustifiedImageHolder.propTypes = {
  image: PropTypes.object.isRequired,
  imageSource: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  backgroundStyle: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  day: PropTypes.string,
  groupTotal: PropTypes.number,
  // Below Pass from Redux
  group: PropTypes.object,
  counter: PropTypes.number,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => ({
  group: state.selectCounter.group,
  counter: state.selectCounter.counter,
});

export default connect(mapStateToProps)(JustifiedImageHolder);
