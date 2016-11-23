import React, { PureComponent, PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import justifiedLayout from 'justified-layout';
import moment from 'moment';

export default class Justified extends PureComponent {

  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {}

  renderJustified() {
    const {
      images,
      editing,
      galleryShowingType,
      containerWidth,
      containerPadding,
      targetRowHeight,
      targetRowHeightTolerance,
      boxSpacing,
      fullWidthBreakoutRowCadence,
    } = this.props;

    if (galleryShowingType === 'nested') {
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

      const imgs = [];

      for (let i = 0; i < images.length; i++) {
        imgs.push(_.extend(images[i], geometry.boxes[i]));
      }

      if (images.length !== geometry.boxes.length) {
        console.error('Images\' length not equal with geometry.boxes, Please check it.'); // eslint-disable-line
      }
      return imgs.map((img) => {
        const imageHolderStyle = {
          width: `${img.width}px`,
          height: `${img.height}px`,
          top: `${img.top}px`,
          left: `${img.left}px`,
        };
        return (
          <div key={img._id} className="justified-image-holder" style={imageHolderStyle}>
            <img src={`${img.url}?imageView2/0/w/${img.width * 2}`} alt={img.name} />
          </div>
        );
      });
    }

    let flag = true;
    const ratios = [];
    const geometrys = [];
    const dayGroupTops = [];

    const dayGroupImages = _.groupBy(images, (image) => moment(image.createdAt).format('YYYYMMDD'));
    _.map(dayGroupImages, (dayGroupImage, day) => {
      ratios[day] = _.map(dayGroupImage, (image) => image.ratio);
      geometrys[day] = justifiedLayout(
        ratios[day],
        {
          containerWidth,
          containerPadding,
          targetRowHeight,
          targetRowHeightTolerance,
          boxSpacing,
          fullWidthBreakoutRowCadence,
        }
      );
    });

    _.reduce(geometrys, (prev, cur, curIndex) => {
      if (flag) {
        dayGroupTops[curIndex] = prev;
        flag = false;
        return cur.containerHeight;
      }
      dayGroupTops[curIndex] = prev;
      const next = prev + cur.containerHeight;
      return next;
    }, 0);

    const imageBgdStyle = editing ? { opacity: 1 } : {};
    return (
      _.map(dayGroupImages, (dayGroupImage, day) => {
        const showDay = day.split('');
        showDay[3] += '年';
        showDay[5] += '月';
        showDay[7] += '日';
        showDay.join('');
        const dayGroupStyle = {
          height: geometrys[day].containerHeight,
        };
        return (
          <div key={day} className="justified-day-group" style={dayGroupStyle}>
            <div className="justified-day-group-title">{showDay}</div>
            {
              _.map(dayGroupImage, (img, i) => {
                const id = img._id;
                // TODO wait for adjust
                const imgSrc = `${img.url}?imageView2/0/w/${geometrys[day].boxes[i].width * 2}`;
                const imageHolderStyle = {
                  left: `${geometrys[day].boxes[i].left}px`,
                  top: `${geometrys[day].boxes[i].top}px`,
                  width: `${geometrys[day].boxes[i].width}px`,
                  height: `${geometrys[day].boxes[i].height}px`,
                };
                return (
                  <div
                    key={id}
                    className="justified-image-holder"
                    style={imageHolderStyle}
                    onTouchTap={() => { this.setState({ [id]: true }); }}
                  >
                    <div className="justified-image-click-background" style={imageBgdStyle} />
                    <img src={imgSrc} alt={img.name} />
                  </div>
                );
              })
            }
          </div>
        );
      })
    );
  }

  renderEditLayout(img) {
    const id = img._id;
    return (
      <div
        key={id}
        style={{
          position: 'absolute',
          width: `${img.width}px`,
          height: `${img.height}px`,
          top: `${img.top}px`,
          left: `${img.left}px`,
          backgroundColor: '#eee',
          overflow: 'hidden',
        }}
        onTouchTap={() => { this.setState({ [id]: true }); }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3))', // eslint-disable-line max-len
          }}
        />
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
    );
  }

  render() {
    const { justifiedContainer } = this.props;
    return (
      <div className={justifiedContainer}>
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
  editing: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired,
  /**
   * galleryShowingType:
   *
   * Define galleryShowingType,
   * eg: 'day-group', 'nested'
   * Default: 'day-group'
   */
  galleryShowingType: PropTypes.oneOf(['day-group', 'nested']),
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
   * onResize:
   *
   * When onResize event fire, this functon will be called/
   */
  onResize: PropTypes.func,
};
