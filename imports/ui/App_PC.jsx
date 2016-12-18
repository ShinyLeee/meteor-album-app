import React, { Component } from 'react';

const src1 = 'http://odsiu8xnd.bkt.clouddn.com/GalleryPlus/show/1.jpg?imageView2/1/w/180/h/210';
const src2 = 'http://odsiu8xnd.bkt.clouddn.com/GalleryPlus/show/2.jpg?imageView2/1/w/180/h/210';
const src3 = 'http://odsiu8xnd.bkt.clouddn.com/GalleryPlus/show/3.jpg?imageView2/1/w/180/h/210';
const src4 = 'http://odsiu8xnd.bkt.clouddn.com/GalleryPlus/show/4.jpg?imageView2/1/w/180/h/210';
const src5 = 'http://odsiu8xnd.bkt.clouddn.com/GalleryPlus/show/5.jpg?imageView2/1/w/180/h/210';
const src6 = 'http://odsiu8xnd.bkt.clouddn.com/GalleryPlus/show/6.jpg?imageView2/1/w/180/h/210';

export default class PC extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: 'PC',
    };
  }

  render() {
    return (
      <div className="pc">
        <div className="pc__header">
          <h1>Gallery Plus</h1>
          <p>暂不支持PC端，请使用移动设备进行访问</p>
        </div>
        <div className="pc__content">
          <div className="pc__line pc__line1">
            <div className="pc__img">
              <img src={src1} alt="pre1" />
            </div>
            <div className="pc__img">
              <img src={src2} alt="pre2" />
            </div>
            <div className="pc__img">
              <img src={src3} alt="pre3" />
            </div>
          </div>
          <div className="pc__line pc__line2">
            <div className="pc__img">
              <img src={src4} alt="pre4" />
            </div>
            <div className="pc__img">
              <img src={src5} alt="pre5" />
            </div>
            <div className="pc__img">
              <img src={src6} alt="pre6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

}
