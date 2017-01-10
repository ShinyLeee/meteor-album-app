import { Meteor } from 'meteor/meteor';
import React from 'react';

const sourceDomain = Meteor.settings.public.sourceDomain;

const src1 = `${sourceDomain}/GalleryPlus/PC/1.jpg?imageView2/1/w/180/h/210`;
const src2 = `${sourceDomain}/GalleryPlus/PC/2.jpg?imageView2/1/w/180/h/210`;
const src3 = `${sourceDomain}/GalleryPlus/PC/3.jpg?imageView2/1/w/180/h/210`;
const src4 = `${sourceDomain}/GalleryPlus/PC/4.jpg?imageView2/1/w/180/h/210`;
const src5 = `${sourceDomain}/GalleryPlus/PC/5.jpg?imageView2/1/w/180/h/210`;
const src6 = `${sourceDomain}/GalleryPlus/PC/6.jpg?imageView2/1/w/180/h/210`;

const PC = () => (
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

export default PC;
