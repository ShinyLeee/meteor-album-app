/* eslint-disable react/prop-types, import/no-mutable-exports */
import React from 'react';
import { CircleLoader } from '/imports/ui/components/Loader';
import {
  ExifLoader as Loader,
  ExifInfo as Info,
} from '../ZoomerHolder.style';

const ExifLoader = () => (
  <Loader>
    <CircleLoader />
    <span>加载中</span>
  </Loader>
);

const ExifInfo = ({ exif, uploadDate }) => (
  <div>
    <Info>
      <span>制造厂商：</span>{(exif.Make && exif.Make.val) || '--'}
    </Info>
    <Info>
      <span>相机型号：</span>{(exif.Model && exif.Model.val) || '--'}
    </Info>
    <Info>
      <span>处理软件：</span>{(exif.Software && exif.Software.val) || '--'}
    </Info>
    <Info>
      <span>曝光时间：</span>{(exif.ExposureTime && exif.ExposureTime.val) || '--'}
    </Info>
    <Info>
      <span>镜头焦距：</span>{(exif.FocalLength && exif.FocalLength.val) || '--'}
    </Info>
    <Info>
      <span>拍摄时间：</span>{(exif.DateTimeOriginal && exif.DateTimeOriginal.val) || '--'}
    </Info>
    <Info>
      <span>修改时间：</span>{(exif.DateTime && exif.DateTime.val) || '--'}
    </Info>
    <Info>
      <span>上传时间：</span>{uploadDate}
    </Info>
    <Info>
      <span>图像尺寸：</span>
      {`${(exif.PixelXDimension && exif.PixelXDimension.val) || '-'} × ${(exif.PixelYDimension && exif.PixelYDimension.val) || '-'}`}
    </Info>
  </div>
);

export {
  ExifLoader,
  ExifInfo,
};

