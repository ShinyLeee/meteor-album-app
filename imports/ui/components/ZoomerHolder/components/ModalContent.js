/* eslint-disable react/prop-types, import/no-mutable-exports */
import React from 'react';
import {
  Content,
  Info,
  InfoHeader,
  InfoNumer,
  StyledHeartIcon,
  StyledEyeIcon,
  StyledCameraIcon,
  ExifInfo,
} from '../ZoomerHolder.style';

const InfoContent = ({ image }) => (
  <Content>
    <Info key="info_like">
      <InfoHeader><StyledHeartIcon />喜欢</InfoHeader>
      <InfoNumer>{image.liker.length}</InfoNumer>
    </Info>
    <Info key="info_view">
      <InfoHeader><StyledEyeIcon />浏览</InfoHeader>
      {/* +1 because this component did not subscribe */}
      <InfoNumer>{(image.view && image.view + 1) || 1}</InfoNumer>
    </Info>
    <Info key="info_coll">
      <InfoHeader><StyledCameraIcon />所属相册</InfoHeader>
      <InfoNumer>{image.collection}</InfoNumer>
    </Info>
  </Content>
);

const ExifContent = ({ exif, uploadDate }) => (
  <Content>
    <ExifInfo>
      <span>制造厂商：</span>{(exif.Make && exif.Make.val) || '--'}
    </ExifInfo>
    <ExifInfo>
      <span>相机型号：</span>{(exif.Model && exif.Model.val) || '--'}
    </ExifInfo>
    <ExifInfo>
      <span>处理软件：</span>{(exif.Software && exif.Software.val) || '--'}
    </ExifInfo>
    <ExifInfo>
      <span>曝光时间：</span>{(exif.ExposureTime && exif.ExposureTime.val) || '--'}
    </ExifInfo>
    <ExifInfo>
      <span>镜头焦距：</span>{(exif.FocalLength && exif.FocalLength.val) || '--'}
    </ExifInfo>
    <ExifInfo>
      <span>拍摄时间：</span>{(exif.DateTimeOriginal && exif.DateTimeOriginal.val) || '--'}
    </ExifInfo>
    <ExifInfo>
      <span>修改时间：</span>{(exif.DateTime && exif.DateTime.val) || '--'}
    </ExifInfo>
    <ExifInfo>
      <span>上传时间：</span>{uploadDate}
    </ExifInfo>
    <ExifInfo>
      <span>图像尺寸：</span>
      {`${(exif.PixelXDimension && exif.PixelXDimension.val) || '-'} × ${(exif.PixelYDimension && exif.PixelYDimension.val) || '-'}`}
    </ExifInfo>
  </Content>
);

export {
  InfoContent,
  ExifContent,
};

