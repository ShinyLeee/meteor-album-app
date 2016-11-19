import React, { Component, PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import justifiedLayout from 'justified-layout';

export default class Justified extends Component {

  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {}

  renderJustified() {
    const {
      images,
      containerWidth,
      containerPadding,
      targetRowHeight,
      targetRowHeightTolerance,
      boxSpacing,
      boxContainer,
      fullWidthBreakoutRowCadence,
    } = this.props;

    const ratio = images.map((image) => image.ratio);
    const geometry = justifiedLayout(
      ratio,
      {
        containerWidth,
        containerPadding,
        targetRowHeight,
        targetRowHeightTolerance,
        boxSpacing,
        fullWidthBreakoutRowCadence,
      }
    );

    if (images.length !== geometry.boxes.length) {
      console.error('Images\' length not equal with geometry.boxes, Please check it.'); // eslint-disable-line
    }

    const imgs = [];

    for (let i = 0; i < images.length; i++) {
      imgs.push(_.extend(images[i], geometry.boxes[i]));
    }

    return imgs.map((img) => (
      <div
        key={img._id}
        className={boxContainer}
        style={{
          position: 'absolute',
          width: `${img.width}px`,
          height: `${img.height}px`,
          top: `${img.top}px`,
          left: `${img.left}px`,
          backgroundColor: '#eee',
          overflow: 'hidden',
        }}
      >
        <img
          src={`${img.url}?imageView2/0/w/${img.width * 2}`} // TODO wait for adjust
          alt={img.name}
          style={{
            width: '100%',
            height: '100%',
            transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
          }}
        />
      </div>
    ));
  }

  render() {
    const { justifiedContainer } = this.props;
    return (
      <div className={justifiedContainer} style={{ position: 'relative' }}>
        {this.renderJustified()}
      </div>
    );
  }
}


Justified.defaultProps = {
  containerWidth: document.body.clientWidth,
  containerPadding: 0,
  targetRowHeight: 200,
  targetRowHeightTolerance: 0.15,
  boxSpacing: 4,
  fullWidthBreakoutRowCadence: false,
  justifiedContainer: 'justified-container',
  boxContainer: 'box-container',
  onResize: this.handleResize,
};

Justified.propTypes = {
  images: PropTypes.array.isRequired,
  /**
   * containerWidth:
   *
   * The width that boxes will be contained within irrelevant of padding.
   */
  containerWidth: PropTypes.number.isRequired,
  /**
   * containerPadding:
   *
   * Provide a single integer to apply padding to all sides or
   * Provide an object to apply individual values to each side
   */
  containerPadding: PropTypes.number.isRequired,
  /**
   * boxSpacing:
   *
   * Provide a single integer to apply spacing both horizontally and vertically or
   * Provide an object to apply individual values to each axis
   */
  boxSpacing: PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
  ]),
  /**
   * fullWidthBreakoutRowCadence:
   *
   * If you'd like to insert a full width box every n rows you can specify it with this parameter.
   * The box on that row will ignore the targetRowHeight,
   * make itself as wide as containerWidth - containerPadding and be
   * as tall as its aspect ratio defines.
   * It'll only happen if that item has an aspect * * ratio >= 1.
   * Best to have a look at the examples to see what this does.
   */
  fullWidthBreakoutRowCadence: PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.number,
  ]),
  /**
   * targetRowHeight:
   *
   * It's called a target because row height is the lever
   * we use in order to fit everything in nicely.
   * The algorithm will get as close to the target row height as it can.
   */
  targetRowHeight: PropTypes.number.isRequired,
  /**
   * targetRowHeightTolerance:
   *
   * How far row heights can stray from targetRowHeight.
   * 0 would force rows to be the targetRowHeight exactly and
   * would likely make it impossible to justify.
   * The value must be between 0 and 1.
   */
  targetRowHeightTolerance: PropTypes.number.isRequired,
  /**
   * justifiedContainer:
   *
   * If provide it would be justifiedContainer's className
   */
  justifiedContainer: PropTypes.string,
  /**
   * boxContainer:
   *
   * If provide it would be boxContainer's className
   */
  boxContainer: PropTypes.string,
  /**
   * onResize:
   *
   * When onResize event fire, this functon will be called/
   */
  onResize: PropTypes.func,
};
