import _ from 'lodash';
import React from 'react';
import settings from '/imports/utils/settings';

const { sourceDomain } = settings;

const PC = () => (
  <div className="pc">
    <div className="pc__header">
      <h1>Gallery Plus</h1>
      <p>暂不支持PC端，请使用移动设备进行访问</p>
    </div>
    <div className="pc__content">
      {
        _.times(6, (n) => (
          <div key={n + 1} className="pc__line">
            <div className="pc__img">
              <img
                src={`${sourceDomain}/GalleryPlus/PC/${n + 1}.jpg?imageView2/1/w/180/h/210`}
                alt=""
              />
            </div>
          </div>
        ))
      }
    </div>
  </div>
);

export default PC;
